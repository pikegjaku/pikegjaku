import type { Context } from 'hono'
import type { UserInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdateUser = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const user = await FindOne<UserInterface>(UsersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
        })

        if (!user)
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = [
            'Name',
            'Surname',
            'BloodGroup',
            'Role',
            'Country',
            'City',
            'ProfileCompleted'
        ]

        const changes: Record<string, unknown> = {}

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                changes[key] = fields[key]
            }
        }

        await Update(UsersTable, user._id, {
            ...changes,
            Updated_At: CurrentTimestamp()
        })

        const updated = await FindOne<UserInterface>(UsersTable, {
            where: '_id = ?',
            params: [id],
            references: {
                Country: CountriesTable,
                City: CitiesTable
            }
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'Përdoruesi u përditësua me sukses.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund të përditësohet.',
            data: null,
            code: 500
        })
    }
}

export default UpdateUser