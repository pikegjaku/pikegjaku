import type { Context } from 'hono'

import { UserModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { StartPhoneVerification } from '@/controllers/helpers/api'
import { Console } from '@/controllers/helpers/logs'

const AuthUser = async (c: Context) => {
    try {
        const { phoneNumber, countryCode } = await c.req.json()

        const user = await UserModel.findOne({
            Phone: phoneNumber,
            Deleted: { $ne: true }
        })

        if (user)
            return await StartPhoneVerification(
                c,
                user,
                phoneNumber,
                countryCode
            )
        else {
            const user = await UserModel.create({
                Phone: phoneNumber,
                PhoneCountryCode: countryCode || '+383',
                Last_Active: CurrentTimestamp(),
                Created_At: CurrentTimestamp(),
                Updated_At: CurrentTimestamp()
            })

            if (user) {
                await user.save()
                return await StartPhoneVerification(
                    c,
                    user,
                    phoneNumber,
                    countryCode
                )
            } else
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