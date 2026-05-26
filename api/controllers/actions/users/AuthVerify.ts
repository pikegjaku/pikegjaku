import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const AuthVerify = async (c: Context) => {
    try {
        const user = c.get('user')
        const token = c.get('token')
        const refresh = c.get('refresh')

        if (user) {
            user.Last_Active = CurrentTimestamp()
            user.Visits = user.Visits + 1

            await user.save()

            return await HttpResponder({
                c,
                success: true,
                message: 'Përdoruesi u verifikua me sukses dhe u ngarkua.',
                code: 200,
                data: {
                    ...user._doc,
                    Token: token,
                    Refresh: refresh
                }
            })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk u gjet ose nuk u verifikua.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('AuthVerify', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Diçka shkoi keq gjatë përpjekjes për të verifikuar sesionin e më hershëm.',
            data: null,
            code: 500
        })
    }
}

export default AuthVerify