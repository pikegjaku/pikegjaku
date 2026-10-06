import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { PostsTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeletePost = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const post = await FindOne<PostInterface>(PostsTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
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
        await Update(PostsTable, post._id, {
            Deleted: post.Deleted,
            Deleted_At: post.Deleted_At
        })

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