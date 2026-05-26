import type { Context } from 'hono'
import type { AuthTokenVerifierFunctionResponseTypes } from '@/ts'

import { deleteCookie } from 'hono/cookie'
import { GenerateJsonWebToken, VerifyJwtToken } from '@/controllers/libs/jwt'
import { TokenExpiredError } from 'jsonwebtoken'
import { Console } from '@/controllers/helpers/logs'

import { AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET, COOKIE_ACCESSORS } from '@/data/constants'

const AuthTokenVerifier = async (
    c: Context
): Promise<AuthTokenVerifierFunctionResponseTypes> => {
    try {
        const token_refresh = c.req.header('Authorization_Refresh')
        const token_access = c.req.header('Authorization_Access')

        if (!token_access || !token_refresh)
            return {
                code: 401,
                userId: null,
                token: null,
                refresh: null,
                message: 'Tokeni nuk u përfshin në krye sepse kjo rrugë kërkon autentikim.'
            }
        else {
            const access_secret = AUTH_ACCESS_TOKEN_SECRET as string
            const refresh_secret = AUTH_REFRESH_TOKEN_SECRET as string

            let response: AuthTokenVerifierFunctionResponseTypes = {
                code: 401,
                userId: null,
                token: null,
                refresh: null,
                message: 'Tokeni i përfshirë në krye është modifikuar ose ka skaduar.'
            }

            try {
                const { userId } = await VerifyJwtToken(
                    token_access,
                    access_secret
                )

                const token = await GenerateJsonWebToken(
                    userId,
                    '10m',
                    'access'
                )
                const refresh = await GenerateJsonWebToken(
                    userId,
                    '365d',
                    'refresh'
                )

                return (response = {
                    code: 200,
                    userId: userId,
                    token,
                    refresh,
                    message: 'Tokeni i përdoruesit u verifikua.'
                })
            } catch (err) {
                if (err instanceof TokenExpiredError) {
                    try {
                        const { userId } = await VerifyJwtToken(
                            token_refresh,
                            refresh_secret
                        )

                        if (userId) {
                            const token = await GenerateJsonWebToken(
                                userId,
                                '10m',
                                'access'
                            )
                            const refresh = await GenerateJsonWebToken(
                                userId,
                                '365d',
                                'refresh'
                            )

                            return (response = {
                                code: 200,
                                userId: userId,
                                token,
                                refresh,
                                message: 'Tokeni i përdoruesit u verifikua.'
                            })
                        }
                    } catch (err) {
                        if (err instanceof TokenExpiredError) {
                            deleteCookie(c, COOKIE_ACCESSORS.ACCESS)
                            deleteCookie(c, COOKIE_ACCESSORS.REFRESH)

                            return (response = {
                                code: 401,
                                userId: null,
                                token: null,
                                refresh: null,
                                message: 'Tokeni i përfshirë në krye është modifikuar ose ka skaduar.'
                            })
                        }
                    }
                }
            }

            return response
        }
    } catch (error) {
        Console.Error('AuthTokenVerifier', error)

        return {
            code: 500,
            userId: null,
            token: null,
            refresh: null,
            message: 'Diçka shkoi keq gjatë përpjekjes për të verifikuar tokenin.'
        }
    }
}

export default AuthTokenVerifier