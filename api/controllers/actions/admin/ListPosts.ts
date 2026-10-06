import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { ListFilter } from '@/controllers/filters'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListPosts = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters = ListFilter(term, ['Title'])

        const [count, posts] = await Promise.all([
            Count(PostsTable, filters),
            Find<PostInterface>(PostsTable, {
                ...filters,
                order: 'Created_At DESC, _id ASC',
                skip: skip || 0,
                limit: limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20,
                references: {
                    User: UsersTable,
                    Country: CountriesTable,
                    City: CitiesTable
                }
            })
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