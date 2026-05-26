import type { VerifyJwtTokenReturnType } from '@/ts'

import { verify } from 'jsonwebtoken'

const VerifyJwtToken = (
    token: string,
    secret: string
): Promise<VerifyJwtTokenReturnType> => {
    return new Promise((resolve, reject) => {
        verify(token, secret, (err, decoded) => {
            if (err) reject(err)
            else if (
                decoded &&
                typeof decoded !== 'string' &&
                'userId' in decoded
            )
                resolve(decoded as VerifyJwtTokenReturnType)
            else reject(new Error())
        })
    })
}

export default VerifyJwtToken