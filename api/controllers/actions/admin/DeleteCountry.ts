import type { Context } from 'hono'
import type { CountryInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteCountry = async (c: Context) => {
    try {
        const { id } = await c.req.json()

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

        country.Deleted = true
        country.Deleted_At = CurrentTimestamp()
        await Update(CountriesTable, country._id, {
            Deleted: country.Deleted,
            Deleted_At: country.Deleted_At
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'U fshi me sukses.',
            code: 200,
            data: null
        })
    } catch (error) {
        Console.Error('AdminDeleteCountry', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Fshirja dështoi.',
            data: null,
            code: 500
        })
    }
}

export default DeleteCountry