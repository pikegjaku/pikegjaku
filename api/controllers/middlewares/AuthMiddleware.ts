import type { Context, Next } from 'hono'

import { Console } from '@/controllers/helpers/logs'
import { HttpResponder } from '@/controllers/helpers/http'
import { UserModel } from '@/data/models'
import { AuthTokenVerifier } from '@/controllers/libs/jwt'

const AuthMiddleware = async (c: Context, next: Next) => {
    try {
        const { code, message, userId, token, refresh } =
            await AuthTokenVerifier(c)

        if (code === 200 && userId && token && refresh) {
            const user = await UserModel.findOne({
                _id: userId,
                Deleted: { $ne: true }
            })

            if (user) {
                c.set('user', user)
                c.set('token', token)
                c.set('refresh', refresh)

                await next()
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Përdoruesi nuk mund të shpërndahet nga tokeni i verifikuar.',
                    data: null,
                    code
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message,
                data: null,
                code
            })
    } catch (error) {
        Console.Error('AuthMiddleware', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Diçka shkoi keq gjatë përpjekjes për të përfunduar autentikimin.',
            data: null,
            code: 500
        })
    }
}

export default AuthMiddleware