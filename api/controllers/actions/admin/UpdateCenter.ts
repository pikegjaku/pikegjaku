import type { Context } from 'hono'

import { CenterModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCenter = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const center = await CenterModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })

        if (!center)
            return await HttpResponder({
                c,
                success: false,
                message: 'Qendra nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = ['Name', 'Address', 'Phone']

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                center.set(key, fields[key])
            }
        }

        center.Updated_At = CurrentTimestamp()
        await center.save()

        const updated = await CenterModel.findById(id)
            .populate(POPULATE.CITY)
            .populate(POPULATE.COUNTRY)
            .lean()

        return await HttpResponder({
            c,
            success: true,
            message: 'Qendra u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCenter', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Qendra nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCenter