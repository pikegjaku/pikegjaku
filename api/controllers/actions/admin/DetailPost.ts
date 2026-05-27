import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'

const DetailPost = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const post = await PostModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })
            .populate(POPULATE.USER)
            .populate(POPULATE.COUNTRY)
            .populate(POPULATE.CITY)
            .lean()

        if (post)
            return await HttpResponder({
                c,
                success: true,
                message: 'Kërkesa u mor me sukses.',
                code: 200,
                data: post
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Kërkesa nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailPost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Kërkesa nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailPost