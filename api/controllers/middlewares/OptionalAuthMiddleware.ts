import type { Context, Next } from 'hono'

import { Console } from '@/controllers/helpers/logs'
import { HttpResponder } from '@/controllers/helpers/http'
import { UserModel } from '@/data/models'
import { AuthTokenVerifier } from '@/controllers/libs/jwt'

const OptionalAuthMiddleware = async (c: Context, next: Next) => {
    try {
        const { code, userId, token, refresh } = await AuthTokenVerifier(c)

        if (code === 200 && userId && token && refresh) {
            const user = await UserModel.findOne({
                _id: userId,
                Deleted: { $ne: true }
            })

            if (user) {
                c.set('user', user)
                c.set('token', token)
                c.set('refresh', refresh)
            }
        }

        await next()
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

export default OptionalAuthMiddleware