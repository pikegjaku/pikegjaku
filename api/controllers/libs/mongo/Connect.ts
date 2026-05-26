import type { Context, Next } from 'hono'

import mongoose from 'mongoose'

import { MONGO_URI, MONGO_OPTIONS } from '@/data/constants'

const Connect = async (_: Context | null, next: Next | null): Promise<void> => {
    if (mongoose.connection.readyState === 1) {
        if (next) await next()
        return
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.set('strictQuery', true)
        await mongoose.connect(MONGO_URI, MONGO_OPTIONS)
    }

    if (next) await next()
}

export default Connect