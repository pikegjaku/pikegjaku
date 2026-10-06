import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { FindOne } from '@/controllers/libs/d1'
import { CentersTable, CitiesTable, CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailCenter = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const center = await FindOne<CenterInterface>(CentersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id],
            references: {
                City: CitiesTable,
                Country: CountriesTable
            }
        })

        if (center)
            return await HttpResponder({
                c,
                success: true,
                message: 'Qendra u mor me sukses.',
                code: 200,
                data: center
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailCenter', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qendra nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailCenter