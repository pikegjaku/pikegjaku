import type { Context } from 'hono'
import type { CityInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCity = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const city = await FindOne<CityInterface>(CitiesTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
        })

        if (!city)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qyteti nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = ['Name', 'Value']

        const changes: Record<string, unknown> = {}

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                changes[key] = fields[key]
            }
        }

        await Update(CitiesTable, city._id, {
            ...changes,
            Updated_At: CurrentTimestamp()
        })

        const updated = await FindOne<CityInterface>(CitiesTable, {
            where: '_id = ?',
            params: [id],
            references: {
                Country: CountriesTable
            }
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'Qyteti u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCity', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qyteti nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCity