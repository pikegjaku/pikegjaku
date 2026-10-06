import type { Handler } from 'hono'
import type { RouteAuthLevel } from '@/ts'

import { Hono } from 'hono'
import { GlobalMiddlewares } from '@/controllers/helpers/api'
import { CatchAll } from '@/controllers/helpers/router'
import {
    AdminMiddleware,
    AuthMiddleware,
    DatabaseSession
} from '@/controllers/middlewares'
import ROUTES from '@/data/Routes'

const MIDDLEWARE_STACK: Record<RouteAuthLevel, Handler[]> = {
    public: [],
    user: [AuthMiddleware as unknown as Handler],
    admin: [
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
                DatabaseSession(Boolean(route.replica)),
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

export default App