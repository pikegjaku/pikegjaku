import type { Context, Next } from 'hono'

import mongoose from 'mongoose'

import { env } from '@goenvless/env/server'
import { MONGO_OPTIONS } from '@/data/constants'

mongoose.set('strictQuery', true)

let pending: Promise<unknown> | null = null

const Connect = async (_: Context | null, next: Next | null): Promise<void> => {
    if (mongoose.connection.readyState !== 1) {
        if (!pending) {
            pending =
                mongoose.connection.readyState === 2
                    ? mongoose.connection.asPromise()
                    : mongoose.connect(env.DATABASE_URL, MONGO_OPTIONS)

            pending
                .catch(() => null)
                .then(() => {
                    pending = null
                })
        }

        await pending
    }

    if (next) await next()
}

export default Connect