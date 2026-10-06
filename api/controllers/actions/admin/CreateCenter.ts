import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { FindOne, Insert } from '@/controllers/libs/d1'
import { CentersTable, CitiesTable, CountriesTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const CreateCenter = async (c: Context) => {
    try {
        const { Name, Address, Phone, City, Country } = await c.req.json()

        if (!Name || !Address || !Phone || !City || !Country)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 400
            })

        const center = await Insert<CenterInterface>(CentersTable, {
            Name,
            Address,
            Phone,
            City,
            Country,
            Created_At: CurrentTimestamp(),
            Updated_At: CurrentTimestamp()
        })

        const populated = await FindOne<CenterInterface>(CentersTable, {
            where: '_id = ?',
            params: [center?._id],
            references: {
                City: CitiesTable,
                Country: CountriesTable
            }
        })

        return await HttpResponder({
            c,
            success: true,
            message: 'Qendra u mor me sukses.',
            code: 201,
            data: populated
        })
    } catch (error) {
        Console.Error('AdminCreateCenter', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qendra nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default CreateCenter