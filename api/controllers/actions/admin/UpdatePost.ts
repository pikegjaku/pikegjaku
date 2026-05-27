import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'
import { CurrentTimestamp } from '@/data/dates'

const UpdatePost = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const post = await PostModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })

        if (!post)
            return await HttpResponder({
                c,
                success: false,
                message: 'Kërkesa nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = ['Title', 'Description', 'Status', 'Urgent']

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                post.set(key, fields[key])
            }
        }

        post.Updated_At = CurrentTimestamp()
        await post.save()

        const updated = await PostModel.findById(id)
            .populate(POPULATE.USER)
            .populate(POPULATE.CITY)
            .populate(POPULATE.COUNTRY)
            .lean()

        return await HttpResponder({
            c,
            success: true,
            message: 'Postimi u përditësua me sukses.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdatePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të përditësohet.',
            data: null,
            code: 500
        })
    }
}

export default UpdatePost