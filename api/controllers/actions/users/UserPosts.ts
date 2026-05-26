import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { PostListSelector } from '@/data/constants/Selectors'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListUserPosts = async (c: Context) => {
    try {
        const user = c.get('user')

        const { skip, limit } = await c.req.json()

        const filters = {
            User: user?._id,
            Deleted: { $ne: true }
        }

        const [count, posts] = await Promise.all([
            PostModel.countDocuments(filters),
            PostModel.find(filters)
                .skip(skip)
                .limit(limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit)
                .sort({ Created_At: -1, Urgent: 1, _id: 1 })
                .populate(POPULATE.USER)
                .populate(POPULATE.CITY)
                .populate(POPULATE.COUNTRY)
                .select(PostListSelector)
                .lean()
        ])

        if (posts && posts?.length > 0)
            return await HttpResponder({
                c,
                success: true,
                message: 'Lista e postimeve të përdoruesit u mor me sukses.',
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
                message: 'Lista e postimeve të përdoruesit u mor me sukses.',
                code: 500,
                data: {
                    posts: [],
                    count: 0
                }
            })
    } catch (error) {
        Console.Error('ListUserPosts', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e postimeve të përdoruesit nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListUserPosts