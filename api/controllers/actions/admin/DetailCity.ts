import type { Context } from 'hono'

import { CityModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'

const DetailCity = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const city = await CityModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })
            .populate(POPULATE.COUNTRY)
            .lean()

        if (city)
            return await HttpResponder({
                c,
                success: true,
                message: 'Qendra u mor me sukses.',
                code: 200,
                data: city
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
        Console.Error('AdminDetailCity', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qendra nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailCity