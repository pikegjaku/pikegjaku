import type { Context } from 'hono'
import type { UserInterface } from '@/ts'

import { FindOne } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailUser = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const user = await FindOne<UserInterface>(UsersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id],
            references: {
                Country: CountriesTable,
                City: CitiesTable
            }
        })

        if (user)
            return await HttpResponder({
                c,
                success: true,
                message: 'Përdoruesi u mor me sukses.',
                code: 200,
                data: user
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailUser