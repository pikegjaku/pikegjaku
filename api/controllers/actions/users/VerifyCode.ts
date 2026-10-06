import type { Context } from 'hono'
import type { UserInterface, VerificationInterface } from '@/ts'

import { FindOne, Update } from '@/controllers/libs/d1'
import { UsersTable, VerificationsTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { GenerateJsonWebToken } from '@/controllers/libs/jwt'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const VerifyCode = async (c: Context) => {
    try {
        const { phoneNumber, code } = await c.req.json()

        const phoneNumberNumeric = phoneNumber
        const codeNumeric = typeof code === 'string' ? parseInt(code) : code

        const user = await FindOne<UserInterface>(UsersTable, {
            where: 'Phone = ? AND Deleted IS NOT 1',
            params: [phoneNumberNumeric]
        })

        if (user) {
            const verification = await FindOne<VerificationInterface>(
                VerificationsTable,
                { where: 'User = ?', params: [user?._id] }
            )

            if (verification) {
                const { Code, Expired, Attempts, Used, Expires_At } =
                    verification

                const code2Numeric =
                    typeof Code === 'string' ? parseInt(Code) : Code

                if (Expired)
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit ka skaduar. Ju lutem kërkoni një kod të ri.',
                        data: null,
                        code: 403
                    })
                else if (Used)
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit është përdorur tashmë.',
                        data: null,
                        code: 403
                    })
                else if (Attempts >= 3) {
                    verification.Expired = true

                    await Update(VerificationsTable, verification._id, {
                        Expired: verification.Expired
                    })

                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit ka skaduar. Ose nuk është i saktë. Kurse ju mundeni të kërkoni një kod të ri.',
                        data: null,
                        code: 403
                    })
                } else if (code2Numeric !== codeNumeric) {
                    verification.Attempts = Attempts + 1

                    await Update(VerificationsTable, verification._id, {
                        Attempts: verification.Attempts
                    })

                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit nuk u gjet. Ju lutem sigurohuni që keni shkruar saktë.',
                        data: null,
                        code: 404
                    })
                } else if (Expires_At < new Date()) {
                    verification.Expired = true

                    await Update(VerificationsTable, verification._id, {
                        Expired: verification.Expired
                    })

                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit ka skaduar. Ose nuk është i saktë. Kurse ju mundeni të kërkoni një kod të ri.',
                        data: null,
                        code: 403
                    })
                } else if (code2Numeric === codeNumeric) {
                    verification.Used = true
                    verification.Expired = true

                    user.CompletedRegistration = true
                    user.Updated_At = CurrentTimestamp()

                    await Update(VerificationsTable, verification._id, {
                        Used: verification.Used,
                        Expired: verification.Expired
                    })
                    await Update(UsersTable, user._id, {
                        CompletedRegistration: user.CompletedRegistration,
                        Updated_At: user.Updated_At
                    })

                    const { User } = verification

                    const userId = String(User?._id || User)

                    const [token, refresh] = await Promise.all([
                        GenerateJsonWebToken(userId, '10m', 'access'),
                        GenerateJsonWebToken(userId, '365d', 'refresh')
                    ])

                    return await HttpResponder({
                        c,
                        success: true,
                        message: 'Kodi i verifikimit të numrit të telefonit u verifikua me sukses.',
                        code: 200,
                        data: {
                            ...user,
                            Token: token,
                            Refresh: refresh
                        }
                    })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Verifikimi i numrit të telefonit dështoi. Nese kjo ndodhë përsëri atëherë kontaktoni supportin.',
                        data: null,
                        code: 500
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Kodi i verifikimit të numrit të telefonit nuk u gjet. Ju lutem sigurohuni që keni shkruar saktë.',
                    data: null,
                    code: 404
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Kodi i verifikimit të numrit të telefonit nuk u gjet. Ju lutem sigurohuni që keni shkruar saktë.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('VerifyCode', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Verifikimi i numrit të telefonit dështoi. Nese kjo ndodhë përsëri atëherë kontaktoni supportin.',
            data: null,
            code: 500
        })
    }
}

export default VerifyCode