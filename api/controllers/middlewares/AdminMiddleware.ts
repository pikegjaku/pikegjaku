import type { Context, Next } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { USER_ROLES } from '@/data/constants'

const AdminMiddleware = async (c: Context, next: Next) => {
    try {
        const user = c.get('user')

        if (user && user.Role === USER_ROLES.ADMIN) await next()
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Ju nuk keni qasje në panelin administrativ.',
                data: null,
                code: 403
            })
    } catch (error) {
        Console.Error('AdminMiddleware', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Ju nuk keni qasje në panelin administrativ.',
            data: null,
            code: 500
        })
    }
}

export default AdminMiddleware