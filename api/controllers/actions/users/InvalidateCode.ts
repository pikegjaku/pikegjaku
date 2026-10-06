import type { Context } from 'hono'
import type { UserInterface, VerificationInterface } from '@/ts'

import { FindOne, Remove } from '@/controllers/libs/d1'
import { UsersTable, VerificationsTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const InvalidateCode = async (c: Context) => {
    try {
        const { phoneNumber } = await c.req.json()

        const user = await FindOne<UserInterface>(UsersTable, {
            where: 'Phone = ? AND Deleted IS NOT 1',
            params: [phoneNumber]
        })

        if (user) {
            const verification = await FindOne<VerificationInterface>(
                VerificationsTable,
                { where: 'User = ?', params: [user?._id] }
            )

            if (verification) {
                await Remove(VerificationsTable, {
                    where: '_id = ?',
                    params: [verification._id]
                })

                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Kodi u pavlefshua me sukses.',
                    code: 200,
                    data: null
                })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Kodi i verifikimit nuk u gjet.',
                    data: null,
                    code: 404
                })
        }

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk u gjet.',
            data: null,
            code: 404
        })
    } catch (error) {
        Console.Error('InvalidateCode', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Kodi i verifikimit nuk u pavlefshua.',
            data: null,
            code: 500
        })
    }
}

export default InvalidateCode