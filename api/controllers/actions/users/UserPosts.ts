import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { PostListSelector } from '@/data/constants/Selectors'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListUserPosts = async (c: Context) => {
    try {
        const user = c.get('user')

        const { skip, limit } = await c.req.json()

        const filters = {
            where: 'User = ? AND Deleted IS NOT 1',
            params: [user?._id]
        }

        const [count, posts] = await Promise.all([
            Count(PostsTable, filters),
            Find<PostInterface>(PostsTable, {
                ...filters,
                columns: PostListSelector,
                order: 'Created_At DESC, Urgent ASC, _id ASC',
                skip,
                limit: limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit,
                references: {
                    User: UsersTable,
                    City: CitiesTable,
                    Country: CountriesTable
                }
            })
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
                code: 200,
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