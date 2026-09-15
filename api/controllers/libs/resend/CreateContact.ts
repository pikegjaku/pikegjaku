import { Resend } from 'resend'
import { env } from '@goenvless/env/server'

const CreateContact = async (email: string): Promise<boolean> => {
    try {
        const resend = new Resend(env.RESEND_API_KEY)

        const response = await resend.contacts.create({
            email,
            unsubscribed: false,
            segments: [
                {
                    id: env.RESEND_SEGMENT_ID
                }
            ]
        })

        if (response && response?.error) return false
        else return true
    } catch (error) {
        console.error('CreateContact', error)
        return false
    }
}

export default CreateContact