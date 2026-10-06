import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { FindOne } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailPost = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const post = await FindOne<PostInterface>(PostsTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id],
            references: {
                User: UsersTable,
                Country: CountriesTable,
                City: CitiesTable
            }
        })

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