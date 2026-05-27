import type { Context } from 'hono'

import { CountryModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const UpdateCountry = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

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

        const allowed = ['Name', 'Code']

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                country.set(key, fields[key])
            }
        }

        country.Updated_At = CurrentTimestamp()
        await country.save()

        const updated = await CountryModel.findById(id).lean()

        return await HttpResponder({
            c,
            success: true,
            message: 'Shteti u përditësua.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateCountry', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Shteti nuk u përditësua.',
            data: null,
            code: 500
        })
    }
}

export default UpdateCountry