import type { Context } from 'hono'

import { UserModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'
import { CurrentTimestamp } from '@/data/dates'

const UpdateUser = async (c: Context) => {
    try {
        const { id, fields } = await c.req.json()

        const user = await UserModel.findOne({
            _id: id,
            Deleted: { $ne: true }
        })

        if (!user)
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk mund tu merrte.',
                data: null,
                code: 404
            })

        const allowed = [
            'Name',
            'Surname',
            'BloodGroup',
            'Role',
            'Country',
            'City',
            'ProfileCompleted'
        ]

        for (const key of Object.keys(fields)) {
            if (allowed.includes(key)) {
                user.set(key, fields[key])
            }
        }

        user.Updated_At = CurrentTimestamp()
        await user.save()

        const updated = await UserModel.findById(id)
            .populate(POPULATE.COUNTRY)
            .populate(POPULATE.CITY)
            .lean()

        return await HttpResponder({
            c,
            success: true,
            message: 'Përdoruesi u përditësua me sukses.',
            code: 200,
            data: updated
        })
    } catch (error) {
        Console.Error('AdminUpdateUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund të përditësohet.',
            data: null,
            code: 500
        })
    }
}

export default UpdateUser