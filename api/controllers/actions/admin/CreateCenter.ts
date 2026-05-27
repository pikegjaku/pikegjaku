import type { Context } from 'hono'

import { CenterModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'
import { CurrentTimestamp } from '@/data/dates'

const CreateCenter = async (c: Context) => {
    try {
        const { Name, Address, Phone, City, Country } = await c.req.json()

        if (!Name)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 400
            })

        const center = await CenterModel.create({
            Name,
            Address: Address || null,
            Phone: Phone || null,
            City: City || null,
            Country: Country || null,
            Created_At: CurrentTimestamp()
        })

        const populated = await CenterModel.findById(center._id)
            .populate(POPULATE.CITY)
            .populate(POPULATE.COUNTRY)
            .lean()

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