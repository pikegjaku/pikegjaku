import type { Context } from 'hono'

import { CityModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteCity = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const city = await CityModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })

        if (!city)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 404
            })

        city.Deleted = true
        city.Deleted_At = CurrentTimestamp()
        await city.save()

        return await HttpResponder({
            c,
            success: true,
            message: 'U fshi me sukses.',
            code: 200,
            data: null
        })
    } catch (error) {
        Console.Error('AdminDeleteCity', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Fshirja dështoi.',
            data: null,
            code: 500
        })
    }
}

export default DeleteCity