import type { NotificationTemplateProps } from '@/ts'

import { env } from '@goenvless/env/server'
import Client from '@/controllers/libs/openemail/Client'
import NotificationTemplate from '@/controllers/libs/openemail/templates/NotificationTemplate'
import Console from '@/controllers/helpers/logs/Console'

const SendSignupNotification = async ({
    email,
    total,
    date
}: NotificationTemplateProps): Promise<boolean> => {
    try {
        await Client().emails.send({
            from: env.OPENEMAIL_FROM,
            to: env.OPENEMAIL_ADMIN,
            replyTo: email,
            subject: `Regjistrim i ri në listën e pritjes — ${email}`,
            html: NotificationTemplate({ email, total, date }),
            text: `Regjistrim i ri.

Email: ${email}
Data: ${date}
Gjithsej në listë: ${total}`,
            tags: { type: 'waitlist-notification' }
        })

        return true
    } catch (error) {
        Console.Error('SendSignupNotification', error)
        return false
    }
}

export default SendSignupNotification