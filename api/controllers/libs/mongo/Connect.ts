import type { Context, Next } from 'hono'
import type { Connection } from 'mongoose'

import mongoose from 'mongoose'

import { env } from 'cloudflare:workers'
import { MONGO_OPTIONS } from '@/data/constants'

mongoose.set('strictQuery', true)

const pending = new WeakMap<Connection, Promise<unknown>>()

const Connect = async (_: Context | null, next: Next | null): Promise<void> => {
    const connection = mongoose.connection

    if (connection.readyState !== 1) {
        if (!pending.has(connection)) {
            const connecting =
                connection.readyState === 2
                    ? connection.asPromise()
                    : mongoose.connect(env.DATABASE_URL, MONGO_OPTIONS)

            pending.set(connection, connecting)

            connecting
                .catch(() => null)
                .then(() => {
                    pending.delete(connection)
                })
        }

        await pending.get(connection)
    }

    if (next) await next()
}

export default Connect