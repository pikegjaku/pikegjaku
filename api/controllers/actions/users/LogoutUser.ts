import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const LogoutUser = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            return await HttpResponder({
                c,
                success: true,
                message: 'Përdoruesi u çlirua me sukses.',
                data: null,
                code: 200
            })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Diçka shkoi keq gjatë daljes.',
                data: null,
                code: 200
            })
    } catch (error) {
        Console.Error('LogoutUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Diçka shkoi keq gjatë daljes.',
            data: null,
            code: 500
        })
    }
}

export default LogoutUser