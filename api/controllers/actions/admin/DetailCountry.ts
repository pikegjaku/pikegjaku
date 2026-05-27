import type { Context } from 'hono'

import { CountryModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const DetailCountry = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const country = await CountryModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        }).lean()

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