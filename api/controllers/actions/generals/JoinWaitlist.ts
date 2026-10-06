import type { Context } from 'hono'
import type { WaitlistInterface } from '@/ts'

import { HttpResponder } from '@/controllers/helpers/http'
import { Count, FindOne, Insert, Update } from '@/controllers/libs/d1'
import { WaitlistsTable } from '@/data/tables'
import {
    SendSignupNotification,
    SendWelcomeEmail
} from '@/controllers/libs/openemail'
import { Console } from '@/controllers/helpers/logs'
import { IsReservedEmail } from '@/controllers/helpers/generals'
import { CurrentTimestamp, FormatDate } from '@/data/dates'
import { WAITLIST_WELCOME_RETRY_MS } from '@/data/constants'
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

        const created = await Insert<WaitlistInterface>(
            WaitlistsTable,
            { Email: normalized, Subscribed_At: CurrentTimestamp() },
            'Email'
        )

        const previous = created
            ? null
            : await FindOne<WaitlistInterface>(WaitlistsTable, {
                  where: 'Email = ?',
                  params: [normalized]
              })

        const inserted = !previous
        const welcomed = Boolean(previous?.Metadata?.EmailId)

        const retryable =
            !previous ||
            Date.now() - new Date(previous.Subscribed_At).getTime() >
                WAITLIST_WELCOME_RETRY_MS

        try {
            if (!welcomed && retryable) {
                const total = await Count(WaitlistsTable)

                const date = FormatDate(new Date())

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

                const entry = created ?? previous

                if (typeof messageId === 'string')
                    await Update(WaitlistsTable, entry?._id, {
                        Metadata: { ...entry?.Metadata, EmailId: messageId }
                    })
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