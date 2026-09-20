import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { WaitlistModel } from '@/data/models'
import {
    SendSignupNotification,
    SendWelcomeEmail
} from '@/controllers/libs/openemail'
import { Console } from '@/controllers/helpers/logs'
import { IsReservedEmail } from '@/controllers/helpers/generals'
import { CurrentTimestamp } from '@/data/dates'
import {
    WAITLIST_DATE_FORMAT,
    WAITLIST_WELCOME_RETRY_MS
} from '@/data/constants'
import { EmailValidation } from '@pikegjaku/shared/validations'

const JoinWaitlist = async (c: Context) => {
    try {
        const { email } = await c.req.json()

        const normalized = String(email || '')
            .trim()
            .toLowerCase()

        const validation = EmailValidation(normalized)

        if (validation.error || IsReservedEmail(normalized))
            return await HttpResponder({
                c,
                success: false,
                code: 400,
                data: null,
                message: 'Email nuk është i vlefshëm.'
            })

        const result = await WaitlistModel.findOneAndUpdate(
            { Email: normalized },
            {
                $setOnInsert: {
                    Email: normalized,
                    Subscribed_At: CurrentTimestamp()
                }
            },
            { upsert: true, new: false, includeResultMetadata: true }
        )

        const previous = result.value
        const inserted = !previous
        const welcomed = Boolean(previous?.Metadata?.EmailId)

        const retryable =
            !previous ||
            Date.now() - new Date(previous.Subscribed_At).getTime() >
                WAITLIST_WELCOME_RETRY_MS

        try {
            if (!welcomed && retryable) {
                const total = await WaitlistModel.countDocuments()

                const date = new Intl.DateTimeFormat(
                    'sq-AL',
                    WAITLIST_DATE_FORMAT
                ).format(new Date())

                const [messageId] = await Promise.all([
                    SendWelcomeEmail(normalized),
                    inserted
                        ? SendSignupNotification({
                              email: normalized,
                              total,
                              date
                          })
                        : false
                ])

                if (typeof messageId === 'string')
                    await WaitlistModel.updateOne(
                        { Email: normalized },
                        { $set: { 'Metadata.EmailId': messageId } }
                    )
            }
        } catch (error) {
            Console.Error('JoinWaitlist', error)
        }

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