import type { Context } from 'hono'

import { CenterModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteCenter = async (c: Context) => {
    try {
        const { id } = await c.req.json()

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

        center.Deleted = true
        center.Deleted_At = CurrentTimestamp()
        await center.save()

        return await HttpResponder({
            c,
            success: true,
            message: 'U fshi me sukses.',
            code: 200,
            data: null
        })
    } catch (error) {
        Console.Error('AdminDeleteCenter', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Fshirja dështoi.',
            data: null,
            code: 500
        })
    }
}

export default DeleteCenter