import type { Context } from 'hono'
import type { UserInterface } from '@/ts'
import type { Document } from 'mongoose'

import { VerificationModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp, TimestampPlusDays } from '@/data/dates'
import { VerificationCodeGenerator } from '@/controllers/helpers/api'
import { Console } from '@/controllers/helpers/logs'
import { SendPhoneMessage } from '@/controllers/libs/sent'
import { PhoneNumberValidation } from '@/controllers/helpers/validations'

const COUNTRY_CODE_MAP: Record<string, string> = {
    '+383': 'XK',
    '+355': 'AL',
    '+389': 'MK'
}

const StartPhoneVerification = async (
    c: Context,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    user: Document<unknown, {}, UserInterface> &
        UserInterface &
        Required<{
            _id: string
        }>,
    phoneNumber: string,
    countryCode?: string
) => {
    try {
        const dialCode = countryCode || '+383'
        const countryKey = COUNTRY_CODE_MAP[dialCode] || 'XK'
        const phoneValidation = PhoneNumberValidation(phoneNumber, countryKey)

        if (phoneValidation?.error)
            return await HttpResponder({
                c,
                success: false,
                message: 'Verifikimi i numrit të telefonit dështoi. Nese kjo ndodhë përsëri atëherë kontaktoni supportin.',
                data: null,
                code: 400
            })
        else {
            const code = await VerificationCodeGenerator()
            const phoneFormated = phoneNumber.replace('+', '')?.trim()

            if (code) {
                await VerificationModel.deleteMany({ User: user._id })

                const verificationObject = {
                    Phone: phoneNumber,
                    Code: code,
                    User: user._id,
                    Expires_At: TimestampPlusDays(15, 'minutes'),
                    Generated_At: CurrentTimestamp()
                }

                const verification =
                    await VerificationModel.create(verificationObject)

                if (verification) {
                    const id = await SendPhoneMessage(
                        phoneFormated,
                        code.toString(),
                        dialCode
                    )

                    if (typeof id === 'string') {
                        verification.Metadata.MessageId = id

                        await verification.save()

                        return await HttpResponder({
                            c,
                            success: true,
                            message: 'Kodi i verifikimit të numrit të telefonit u dërgua me sukses për të vazhduar.',
                            data: null,
                            code: 200
                        })
                    } else
                        return await HttpResponder({
                            c,
                            success: false,
                            message: 'Kodi i verifikimit të numrit të telefonit nuk mund të dërgohej në këtë numër.',
                            data: null,
                            code: 500
                        })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Kodi i verifikimit të numrit të telefonit nuk mund të gjenerohej.',
                        data: null,
                        code: 500
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Kodi i verifikimit të numrit të telefonit nuk mund të gjenerohej.',
                    data: null,
                    code: 500
                })
        }
    } catch (error) {
        Console.Error('StartPhoneVerification', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Diçka shkoi keq gjatë përpjekjes për të përfunduar autentikimin.',
            data: null,
            code: 500
        })
    }
}

export default StartPhoneVerification