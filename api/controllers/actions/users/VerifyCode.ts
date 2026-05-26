import type { Context } from 'hono'

import { UserModel, VerificationModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { GenerateJsonWebToken } from '@/controllers/libs/jwt'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

const VerifyCode = async (c: Context) => {
    try {
        const { phoneNumber, code } = await c.req.json()

        const phoneNumberNumeric = phoneNumber
        const codeNumeric = typeof code === 'string' ? parseInt(code) : code

        const user = await UserModel.findOne({
            Phone: phoneNumberNumeric,
            Deleted: {
                $ne: true
            }
        })

        if (user) {
            const verification = await VerificationModel.findOne({
                User: user?._id
            })

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

                    await verification.save()

                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit ka skaduar. Ose nuk është i saktë. Kurse ju mundeni të kërkoni një kod të ri.',
                        data: null,
                        code: 403
                    })
                } else if (code2Numeric !== codeNumeric) {
                    verification.Attempts = Attempts + 1

                    await verification.save()

                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit nuk u gjet. Ju lutem sigurohuni që keni shkruar saktë.',
                        data: null,
                        code: 404
                    })
                } else if (Expires_At < new Date()) {
                    verification.Expired = true

                    await verification.save()
                    await user.save()

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

                    await verification.save()
                    await user.save()

                    const { User } = verification

                    const userId = (User?._id || User) as string

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
                            // @ts-expect-error - doesn't like the _doc property
                            ...user._doc,
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