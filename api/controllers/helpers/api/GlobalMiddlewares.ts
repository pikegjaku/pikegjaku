import type { HonoBase } from 'hono/hono-base'

import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { ApiCors } from '@/controllers/middlewares'

const GlobalMiddlewares = async (route: string, api: HonoBase) => {
    api.use(`${route}/*`, etag())
    api.use(`${route}/*`, logger())
    api.use(`${route}/*`, ApiCors)
}

export default GlobalMiddlewares