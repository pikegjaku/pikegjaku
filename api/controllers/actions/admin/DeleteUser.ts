import type { Context } from 'hono'

import { UserModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteUser = async (c: Context) => {
    try {
        const { id } = await c.req.json()

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

        user.Deleted = true
        user.Deleted_At = CurrentTimestamp()
        await user.save()

        return await HttpResponder({
            c,
            success: true,
            message: 'U fshi me sukses.',
            code: 200,
            data: null
        })
    } catch (error) {
        Console.Error('AdminDeleteUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Fshirja dështoi.',
            data: null,
            code: 500
        })
    }
}

export default DeleteUser