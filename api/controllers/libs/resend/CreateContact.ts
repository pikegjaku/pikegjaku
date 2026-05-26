import { Resend } from 'resend'
import { RESEND_API_KEY, RESEND_SEGMENT_ID } from '@/data/constants'

const CreateContact = async (email: string): Promise<boolean> => {
    try {
        const resend = new Resend(RESEND_API_KEY)

        const response = await resend.contacts.create({
            email,
            unsubscribed: false,
            segments: [
                {
                    id: RESEND_SEGMENT_ID
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