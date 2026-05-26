import type { StringValue } from 'ms'

import { sign } from 'jsonwebtoken'
import { AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET } from '@/data/constants'

const GenerateJsonWebToken = async (
    userId: string,
    expiresIn: StringValue,
    mode: 'access' | 'refresh'
) => {
    const secret =
        mode === 'access' ? AUTH_ACCESS_TOKEN_SECRET : AUTH_REFRESH_TOKEN_SECRET

    return sign({ userId }, secret, { expiresIn })
}

export default GenerateJsonWebToken