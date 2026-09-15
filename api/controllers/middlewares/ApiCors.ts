import type { Context, Next } from 'hono'

import { cors } from 'hono/cors'
import { env } from '@goenvless/env/server'
import { ENVIRONMENTS } from '@/data/constants'

const ApiCors = async (c: Context, next: Next) => {
    const isStar = env.ENV === ENVIRONMENTS.LOCAL || env.ORIGINS === '*'
    const origin = isStar ? '*' : env.ORIGINS.split(',')

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