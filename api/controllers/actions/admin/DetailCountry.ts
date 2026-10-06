import type { Context } from 'hono'
import type { CountryInterface } from '@/ts'

import { FindOne } from '@/controllers/libs/d1'
import { CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailCountry = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const country = await FindOne<CountryInterface>(CountriesTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
        })

        if (country)
            return await HttpResponder({
                c,
                success: true,
                message: 'Shteti u mor me sukses.',
                code: 200,
                data: country
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Shteti nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailCountry', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Shteti nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailCountry