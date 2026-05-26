import type { Context } from 'hono'

import { UserModel, VerificationModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const InvalidateCode = async (c: Context) => {
    try {
        const { phoneNumber } = await c.req.json()

        const phoneNumberNumeric =
            typeof phoneNumber === 'string'
                ? parseInt(phoneNumber)
                : phoneNumber
        const user = await UserModel.findOne({
            Phone: phoneNumberNumeric,
            Deleted: { $ne: true }
        })

        if (user) {
            const verification = await VerificationModel.findOne({
                User: user?._id
            })

            if (verification) {
                await verification.deleteOne()

                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Kodi u pavlefshua me sukses.',
                    code: 200,
                    data: null
                })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Kodi i verifikimit nuk u gjet.',
                    data: null,
                    code: 404
                })
        }

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk u gjet.',
            data: null,
            code: 404
        })
    } catch (error) {
        Console.Error('InvalidateCode', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Kodi i verifikimit nuk u pavlefshua.',
            data: null,
            code: 500
        })
    }
}

export default InvalidateCode