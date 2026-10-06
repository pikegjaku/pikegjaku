import type { Context } from 'hono'
import type { UserInterface, VerificationInterface } from '@/ts'

import { Insert, Remove, Update } from '@/controllers/libs/d1'
import { VerificationsTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp, TimestampPlusDays } from '@/data/dates'
import { VerificationCodeGenerator } from '@/controllers/helpers/api'
import { Console } from '@/controllers/helpers/logs'
import { SendPhoneMessage } from '@/controllers/libs/sent'
import { PhoneNumberValidation } from '@/controllers/helpers/validations'
import { DIAL_CODE_COUNTRIES } from '@/data/constants'

const StartPhoneVerification = async (
    c: Context,
    user: UserInterface,
    phoneNumber: string,
    countryCode?: string
) => {
    try {
        const dialCode = countryCode || '+383'
        const countryKey = DIAL_CODE_COUNTRIES[dialCode] || 'XK'
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
                await Remove(VerificationsTable, {
                    where: 'User = ?',
                    params: [user._id]
                })

                const verification = await Insert<VerificationInterface>(
                    VerificationsTable,
                    {
                        Code: code,
                        User: user._id,
                        Expires_At: TimestampPlusDays(15, 'minutes'),
                        Generated_At: CurrentTimestamp()
                    }
                )

                if (verification) {
                    const id = await SendPhoneMessage(
                        phoneFormated,
                        code.toString(),
                        dialCode
                    )

                    if (typeof id === 'string') {
                        verification.Metadata.MessageId = id

                        await Update(VerificationsTable, verification._id, {
                            Metadata: verification.Metadata
                        })

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