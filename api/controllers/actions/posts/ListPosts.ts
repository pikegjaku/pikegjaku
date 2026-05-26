import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { PostsListFilter } from '@/controllers/filters'
import { PostListSelector } from '@/data/constants/Selectors'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListPosts = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { skip, limit, options } = await c.req.json()
            const { term, city, same_blood_group, mode } = options

            const filters = PostsListFilter({
                user,
                term,
                city,
                same_blood_group,
                mode
            })

            const [count, posts] = await Promise.all([
                PostModel.countDocuments(filters),
                PostModel.find(filters)
                    .populate(POPULATE.USER)
                    .populate(POPULATE.COUNTRY)
                    .populate(POPULATE.CITY)
                    .select(PostListSelector)
                    .sort({ Urgent: -1, Created_At: -1, _id: 1 })
                    .skip(skip)
                    .limit(limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit)
                    .lean()
            ])

            if (posts) {
                if (posts?.length > 0)
                    return await HttpResponder({
                        c,
                        success: true,
                        message: 'Lista e postimeve u mor me sukses.',
                        code: 200,
                        data: {
                            posts,
                            count
                        }
                    })
                else
                    return await HttpResponder({
                        c,
                        success: true,
                        message: 'Lista e postimeve u mor por është bosh.',
                        code: 200,
                        data: {
                            posts: [],
                            count: 0
                        }
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Lista e postimeve nuk mund tu merrte.',
                    data: null,
                    code: 500
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk është i autorizuar të shohë postimet.',
                data: null,
                code: 401
            })
    } catch (error) {
        Console.Error('ListPosts', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e postimeve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListPosts