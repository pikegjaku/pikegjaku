import type { HonoBase } from 'hono/hono-base'

import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { bodyLimit } from 'hono/body-limit'
import { ApiCors } from '@/controllers/middlewares'
import { HttpResponder } from '@/controllers/helpers/http'
import { MAX_REQUEST_BYTES } from '@/data/constants'

const GlobalMiddlewares = async (route: string, api: HonoBase) => {
    api.use(`${route}/*`, etag())
    api.use(`${route}/*`, logger())
    api.use(`${route}/*`, ApiCors)
    api.use(
        `${route}/*`,
        bodyLimit({
            maxSize: MAX_REQUEST_BYTES,
            onError: (c) =>
                HttpResponder({
                    c,
                    success: false,
                    message: 'Kërkesa është shumë e madhe.',
                    data: null,
                    code: 413
                })
        })
    )
}

export default GlobalMiddlewares