import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CreateContact } from '@/controllers/libs/resend'
import { Console } from '@/controllers/helpers/logs'
import { EmailValidation } from '@pikegjaku/shared/validations'

const JoinWaitlist = async (c: Context) => {
    try {
        const { email } = await c.req.json()

        const validation = EmailValidation(email)

        if (validation.error)
            return await HttpResponder({
                c,
                success: false,
                code: 400,
                data: null,
                message: 'Email nuk është i vlefshëm.'
            })

        const created = await CreateContact(email)

        if (!created)
            return await HttpResponder({
                c,
                success: false,
                code: 500,
                data: null,
                message: 'Diçka shkoi keq gjatë regjistrimit të email.'
            })

        return await HttpResponder({
            c,
            success: true,
            code: 200,
            data: null,
            message: 'Email u regjistrua me sukses.'
        })
    } catch (error) {
        Console.Error('JoinWaitlist', error)

        return await HttpResponder({
            c,
            success: false,
            code: 500,
            data: null,
            message: 'Diçka shkoi keq gjatë regjistrimit të email.'
        })
    }
}

export default JoinWaitlist