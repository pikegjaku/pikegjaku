import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdatePost = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

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

        const allowed = ['Title', 'Description', 'Status', 'Urgent']

        const changes: Record<string, unknown> = {}

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                changes[key] = fields[key]
            }
        }

        await Update(PostsTable, post._id, {
            ...changes,
            Updated_At: CurrentTimestamp()
        })

        const updated = await FindOne<PostInterface>(PostsTable, {
            where: '_id = ?',
            params: [id],
            references: {
                User: UsersTable,
                City: CitiesTable,
                Country: CountriesTable
            }
        })

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