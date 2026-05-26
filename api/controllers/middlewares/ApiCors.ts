import type { Context, Next } from 'hono'

import { cors } from 'hono/cors'
import { ORIGINS, ENV, ENVIRONMENTS } from '@/data/constants'

const ApiCors = async (c: Context, next: Next) => {
    const isStar = ENV === ENVIRONMENTS.LOCAL || ORIGINS === '*'
    const origin = isStar ? '*' : ORIGINS.split(',')

    const corsMiddleware = cors({
        origin,
        allowHeaders: ['*'],
        allowMethods: ['*'],
        exposeHeaders: ['*'],
        maxAge: 600,
        credentials: true
    })

    return await corsMiddleware(c, next)
}

export default ApiCors