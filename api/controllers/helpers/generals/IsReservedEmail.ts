import { RESERVED_EMAIL_DOMAINS } from '@/data/constants'

const IsReservedEmail = (email: string): boolean => {
    const domain = String(email).split('@')[1]?.toLowerCase()

    if (!domain) return true

    return RESERVED_EMAIL_DOMAINS.some(
        (reserved) => domain === reserved || domain.endsWith(`.${reserved}`)
    )
}

export default IsReservedEmail