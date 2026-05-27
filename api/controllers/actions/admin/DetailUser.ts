import type { Context } from 'hono'

import { UserModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'

const DetailUser = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const user = await UserModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })
            .populate(POPULATE.COUNTRY)
            .populate(POPULATE.CITY)
            .lean()

        if (user)
            return await HttpResponder({
                c,
                success: true,
                message: 'Përdoruesi u mor me sukses.',
                code: 200,
                data: user
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk mund tu merrte.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AdminDetailUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default DetailUser