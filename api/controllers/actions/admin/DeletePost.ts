import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeletePost = async (c: Context) => {
    try {
        const { id } = await c.req.json()

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

        post.Deleted = true
        post.Deleted_At = CurrentTimestamp()
        await post.save()

        return await HttpResponder({
            c,
            success: true,
            message: 'U fshi me sukses.',
            code: 200,
            data: null
        })
    } catch (error) {
        Console.Error('AdminDeletePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Fshirja dështoi.',
            data: null,
            code: 500
        })
    }
}

export default DeletePost