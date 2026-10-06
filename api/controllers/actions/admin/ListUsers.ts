import type { Context } from 'hono'
import type { UserInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, UsersTable } from '@/data/tables'
import { ListFilter } from '@/controllers/filters'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListUsers = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters = ListFilter(term, ['Name', 'Surname', 'Phone'])

        const [count, users] = await Promise.all([
            Count(UsersTable, filters),
            Find<UserInterface>(UsersTable, {
                ...filters,
                order: 'Created_At DESC, _id ASC',
                skip: skip || 0,
                limit: limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20,
                references: {
                    Country: CountriesTable,
                    City: CitiesTable
                }
            })
        ])

        if (users) {
            if (users?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e përdoruesve u mor me sukses.',
                    code: 200,
                    data: { users, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e përdoruesve u mor por është bosh.',
                    code: 200,
                    data: { users: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e përdoruesve nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListUsers', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e përdoruesve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListUsers