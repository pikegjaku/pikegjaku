import type { Context } from 'hono'
import type { CountryInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCountry = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const country = await FindOne<CountryInterface>(CountriesTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
        })

        if (!country)
            return await HttpResponder({
                c,
                success: false,
                message: 'Shteti nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = ['Name', 'Code']

        const changes: Record<string, unknown> = {}

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                changes[key] = fields[key]
            }
        }

        await Update(CountriesTable, country._id, {
            ...changes,
            Updated_At: CurrentTimestamp()
        })

        const updated = await FindOne<CountryInterface>(CountriesTable, {
            where: '_id = ?',
            params: [id]
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'Shteti u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCountry', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Shteti nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCountry