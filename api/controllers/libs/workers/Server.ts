import type { Hono } from 'hono'

import { DurableObject } from 'cloudflare:workers'

// Workers cannot reuse a socket across requests, so this single long-lived object owns the MongoDB pool for every request.
class Server extends DurableObject<Env> {
    app: Hono | null = null

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env)

        ctx.blockConcurrencyWhile(async () => {
            const [{ App }, { Reset }] = await Promise.all([
                import('@/router'),
                import('@/controllers/libs/mongo')
            ])

            Reset()
            this.app = App
        })
    }

    async fetch(request: Request): Promise<Response> {
        const response = await (this.app as Hono).fetch(request)

        // workerd logs an error when a forwarded body is still unread after the response is sent.
        if (request.body && !request.bodyUsed)
            await request.body.pipeTo(new WritableStream())

        return response
    }
}

export default Server