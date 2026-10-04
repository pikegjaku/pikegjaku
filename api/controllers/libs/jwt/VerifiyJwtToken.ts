import type { VerifyJwtTokenReturnType } from '@/ts'

import { jwtVerify } from 'jose'
import { JWT_ALGORITHM } from '@/data/constants'

const VerifyJwtToken = async (
    token: string,
    secret: string
): Promise<VerifyJwtTokenReturnType> => {
    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
        { algorithms: [JWT_ALGORITHM] }
    )

    if ('userId' in payload) return payload as VerifyJwtTokenReturnType

    throw new Error()
}

export default VerifyJwtToken