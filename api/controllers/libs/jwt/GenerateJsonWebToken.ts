import type { StringValue } from 'ms'

import { SignJWT } from 'jose'
import { env } from 'cloudflare:workers'
import { JWT_ALGORITHM } from '@/data/constants'

const GenerateJsonWebToken = async (
    userId: string,
    expiresIn: StringValue,
    mode: 'access' | 'refresh'
) => {
    const secret =
        mode === 'access' ? env.AUTH_ACCESS_TOKEN_SECRET : env.AUTH_REFRESH_TOKEN_SECRET

    return new SignJWT({ userId })
        .setProtectedHeader({ alg: JWT_ALGORITHM, typ: 'JWT' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(new TextEncoder().encode(secret))
}

export default GenerateJsonWebToken