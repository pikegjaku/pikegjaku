import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CentersTable, CitiesTable, CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCenter = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const center = await FindOne<CenterInterface>(CentersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
        })

        if (!center)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = ['Name', 'Address', 'Phone']

        const changes: Record<string, unknown> = {}

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                changes[key] = fields[key]
            }
        }

        await Update(CentersTable, center._id, {
            ...changes,
            Updated_At: CurrentTimestamp()
        })

        const updated = await FindOne<CenterInterface>(CentersTable, {
            where: '_id = ?',
            params: [id],
            references: {
                City: CitiesTable,
                Country: CountriesTable
            }
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'Qendra u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCenter', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qendra nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCenter