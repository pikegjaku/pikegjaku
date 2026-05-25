import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const PHONE_LENGTHS: Record<string, number> = {
    XK: 8,
    AL: 9,
    MK: 8
}

export const PhoneNumberValidation = (
    number: string | null,
    countryCode: string = 'XK'
): ValidationReturnType => {
    const phone = number?.toString()
    const length = PHONE_LENGTHS[countryCode] || 8

    const stringCase = z.string().safeParse(phone)

    if (!stringCase.success)
        return {
            message: 'Numri i telefonit duhet të jetë i plotësuar!',
            error: true
        }

    const minLengthCase = z.string().min(length).safeParse(phone)

    if (!minLengthCase.success)
        return {
            message:
                'Numri i telefonit duhet të jetë më i gjatë se 8 karaktere!',
            error: true
        }

    const maxLengthCase = z.string().max(length).safeParse(phone)

    if (!maxLengthCase.success)
        return {
            message:
                'Numri i telefonit duhet të jetë më i shkurtë se 8 karaktere!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default PhoneNumberValidation