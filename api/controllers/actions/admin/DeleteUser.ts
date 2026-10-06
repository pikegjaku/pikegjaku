import type { Context } from 'hono'
import type { UserInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const DeleteUser = async (c: Context) => {
    try {
        const { id } = await c.req.json()

        const user = await FindOne<UserInterface>(UsersTable, {
            where: '_id = ? AND Deleted IS NOT 1',
            params: [id]
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
        await Update(UsersTable, user._id, {
            Deleted: user.Deleted,
            Deleted_At: user.Deleted_At
        })

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