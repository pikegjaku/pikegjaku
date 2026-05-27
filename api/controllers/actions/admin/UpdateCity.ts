import type { Context } from 'hono'

import { CityModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCity = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

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

        const allowed = ['Name', 'Value']

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                city.set(key, fields[key])
            }
        }

        city.Updated_At = CurrentTimestamp()
        await city.save()

        const updated = await CityModel.findById(id)
            .populate(POPULATE.COUNTRY)
            .lean()

        return await HttpResponder({
            c,
            success: true,
            message: 'Qyteti u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCity', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qyteti nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCity