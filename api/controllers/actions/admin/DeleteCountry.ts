import type { Context } from 'hono'

import { CountryModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteCountry = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const country = await CountryModel.findOne({
            _id: id,
            Deleted: { $ne: true }
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
        await country.save()

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