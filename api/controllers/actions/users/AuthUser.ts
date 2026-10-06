import type { Context } from 'hono'
import type { UserInterface } from '@/ts'

import { FindOne, Insert } from '@/controllers/libs/d1'
import { UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { StartPhoneVerification } from '@/controllers/helpers/api'
import { Console } from '@/controllers/helpers/logs'
import { PhoneNumberValidation } from '@/controllers/helpers/validations'
import { DIAL_CODE_COUNTRIES } from '@/data/constants'

const AuthUser = async (c: Context) => {
    try {
        const { phoneNumber, countryCode } = await c.req.json()

        const user = await FindOne<UserInterface>(UsersTable, {
            where: 'Phone = ? AND Deleted IS NOT 1',
            params: [phoneNumber]
        })

        if (user)
            return await StartPhoneVerification(
                c,
                user,
                phoneNumber,
                countryCode
            )
        else {
            const countryKey = DIAL_CODE_COUNTRIES[countryCode || '+383'] || 'XK'

            if (PhoneNumberValidation(phoneNumber, countryKey).error)
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Verifikimi i numrit të telefonit dështoi. Nese kjo ndodhë përsëri atëherë kontaktoni supportin.',
                    data: null,
                    code: 400
                })

            const user = await Insert<UserInterface>(UsersTable, {
                Phone: phoneNumber,
                PhoneCountryCode: countryCode || '+383',
                Last_Active: CurrentTimestamp(),
                Created_At: CurrentTimestamp(),
                Updated_At: CurrentTimestamp()
            })

            if (user)
                return await StartPhoneVerification(
                    c,
                    user,
                    phoneNumber,
                    countryCode
                )
            else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Përdoruesi nuk mund të krijohet.',
                    data: null,
                    code: 500
                })
        }
    } catch (error) {
        Console.Error('AuthUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Diçka shkoi keq gjatë përpjekjes për të përfunduar autentikimin.',
            data: null,
            code: 500
        })
    }
}

export default AuthUser