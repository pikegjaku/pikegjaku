import type { Context } from 'hono'

import { CenterModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'

const DetailCenter = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const center = await CenterModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })
            .populate(POPULATE.CITY)
            .populate(POPULATE.COUNTRY)
            .lean()

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