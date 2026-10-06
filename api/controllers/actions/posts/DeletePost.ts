import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'
import { FindOne, Increment, Update } from '@/controllers/libs/d1'

import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'

const DeletePost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { postId } = await c.req.json()

            const post = await FindOne<PostInterface>(PostsTable, {
                where: '_id = ? AND Deleted IS NOT 1',
                params: [postId]
            })

            if (post) {
                const isAllowed =
                    post?.User?.toString() === user?._id?.toString()

                if (isAllowed) {
                    user.Posts = user.Posts - 1
                    post.Deleted = true
                    post.Deleted_At = CurrentTimestamp()

                    await Promise.all([
                        Update(UsersTable, user._id, { Posts: user.Posts }),
                        Update(PostsTable, post._id, {
                            Deleted: post.Deleted,
                            Deleted_At: post.Deleted_At
                        }),
                        Increment(CountriesTable, post.Country, 'Posts', -1),
                        Increment(CitiesTable, post.City, 'Posts', -1)
                    ])

                    return await HttpResponder({
                        c,
                        success: true,
                        message: 'Postimi u fshi me sukses.',
                        data: null,
                        code: 200
                    })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Përdoruesi nuk është i autorizuar të fshijë këtë postim.',
                        data: null,
                        code: 401
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Postimi nuk u gjet.',
                    data: null,
                    code: 404
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk u gjet ose nuk është i autentikuar.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('DeletePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të fshihet.',
            data: null,
            code: 500
        })
    }
}

export default DeletePost