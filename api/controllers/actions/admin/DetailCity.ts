import type { Context } from 'hono'
import type { CityInterface } from '@/ts'

import { FindOne } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailCity = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const city = await FindOne<CityInterface>(CitiesTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id],
            references: {
                Country: CountriesTable
            }
        })

        if (city)
            return await HttpResponder({
                c,
                success: true,
                message: 'Qyteti u mor me sukses.',
                code: 200,
                data: city
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Qyteti nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailCity', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qyteti nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailCity