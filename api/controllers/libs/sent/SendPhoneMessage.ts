import type { SentMessagesResponse } from '@/ts'

import { env } from '@goenvless/env/server'
import Console from '@/controllers/helpers/logs/Console'
import { ENVIRONMENTS, EXTERNAL_APIS } from '@/data/constants'

const SendPhoneMessage = async (
    phone: string,
    code: string,
    countryCode: string = '+383'
): Promise<false | string> => {
    try {
        let formattedPhone: string = phone

        if (!formattedPhone?.includes('+'))
            formattedPhone = `${countryCode}${formattedPhone}`
        else if (!formattedPhone?.startsWith('+'))
            formattedPhone = `+${formattedPhone}`

        if (env.ENV === ENVIRONMENTS.LOCAL) {
            Console.Info(
                'SendPhoneMessage',
                `[DEV] Verification code for ${formattedPhone}: ${code}`
            )
            return 'dev-message-id'
        }

        const response = await fetch(EXTERNAL_APIS.SENT.MESSAGES, {
            method: 'POST',
            headers: {
                'x-api-key': env.SENT_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: [formattedPhone],
                channel: ['sms'],
                template: {
                    id: env.SENT_TEMPLATE_ID,
                    parameters: { code }
                }
            })
        })

        if (!response.ok) return false

        const data = (await response.json()) as SentMessagesResponse

        const messageId = data?.data?.recipients?.[0]?.message_id
        if (data?.success && messageId) return messageId
        else return false
    } catch (error) {
        Console.Error('SendPhoneMessage', error)
        return false
    }
}

export default SendPhoneMessage