import type { Handler } from 'hono'
import type { RouteAuthLevel } from '@/ts'

import { Hono } from 'hono'
import { GlobalMiddlewares } from '@/controllers/helpers/api'
import { CatchAll } from '@/controllers/helpers/router'
import { AdminMiddleware, AuthMiddleware } from '@/controllers/middlewares'
import { Connect } from '@/controllers/libs/mongo'
import ROUTES from '@/data/Routes'

const MIDDLEWARE_STACK: Record<RouteAuthLevel, Handler[]> = {
    public: [],
    db: [Connect as unknown as Handler],
    user: [Connect as unknown as Handler, AuthMiddleware as unknown as Handler],
    admin: [
        Connect as unknown as Handler,
        AuthMiddleware as unknown as Handler,
        AdminMiddleware as unknown as Handler
    ]
}

const InitInstance = () => {
    const api = new Hono()

    const groups = Array.from(new Set(ROUTES.map((r) => r.group)))

    for (const group of groups) {
        const sub = new Hono()

        for (const route of ROUTES) {
            if (route.group !== group) continue
            const chain = [
                ...MIDDLEWARE_STACK[route.auth],
                route.handler
            ] as unknown as [Handler, ...Handler[]]
            sub.post(route.path, ...chain)
        }

        GlobalMiddlewares(group, api)
        api.route(group, sub)
    }

    api.notFound(CatchAll)

    return api
}

const App = InitInstance()

export default {
    port: Number(process.env.PORT) || 9999,
    fetch: App.fetch
}