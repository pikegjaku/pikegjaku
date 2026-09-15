import type { StringValue } from 'ms'

import { sign } from 'jsonwebtoken'
import { env } from '@goenvless/env/server'

const GenerateJsonWebToken = async (
    userId: string,
    expiresIn: StringValue,
    mode: 'access' | 'refresh'
) => {
    const secret =
        mode === 'access' ? env.AUTH_ACCESS_TOKEN_SECRET : env.AUTH_REFRESH_TOKEN_SECRET

    return sign({ userId }, secret, { expiresIn })
}

export default GenerateJsonWebToken