import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const ListPost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { postId } = await c.req.json()

            const post = await FindOne<PostInterface>(PostsTable, {
                where: '_id = ? AND Deleted IS NOT 1',
                params: [postId],
                references: {
                    User: UsersTable,
                    Country: CountriesTable,
                    City: CitiesTable
                }
            })

            if (post) {
                post.Views = post.Views + 1
                await Update(PostsTable, post._id, { Views: post.Views })

                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Postimi u gjet me sukses.',
                    data: post,
                    code: 200
                })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Postimi nuk mund të gjendet.',
                    data: null,
                    code: 404
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk është i autorizuar të shohë këtë postim.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('ViewPost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të gjendet për shkak të një gabimi.',
            data: null,
            code: 500
        })
    }
}

export default ListPost