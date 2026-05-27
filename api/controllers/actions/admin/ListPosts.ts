import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListPosts = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (term) {
            filters.Title = { $regex: term, $options: 'i' }
        }

        const [count, posts] = await Promise.all([
            PostModel.countDocuments(filters),
            PostModel.find(filters)
                .populate(POPULATE.USER)
                .populate(POPULATE.COUNTRY)
                .populate(POPULATE.CITY)
                .sort({ Created_At: -1, _id: 1 })
                .skip(skip || 0)
                .limit(
                    limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20
                )
                .lean()
        ])

        if (posts) {
            if (posts?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e kërkesave u mor me sukses.',
                    code: 200,
                    data: { posts, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e kërkesave u mor por është bosh.',
                    code: 200,
                    data: { posts: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e kërkesave nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListPosts', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e kërkesave nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListPosts