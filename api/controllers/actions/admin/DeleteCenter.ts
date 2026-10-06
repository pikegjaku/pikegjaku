import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { CentersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteCenter = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const center = await FindOne<CenterInterface>(CentersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
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
        await Update(CentersTable, center._id, {
            Deleted: center.Deleted,
            Deleted_At: center.Deleted_At
        })

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