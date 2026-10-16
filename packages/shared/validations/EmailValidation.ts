import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const EmailValidation = (email: string | null): ValidationReturnType => {
    const requiredCase = z.string().min(1).safeParse(email)

    if (!requiredCase.success)
        return {
            message: 'Email duhet të jetë i plotësuar!',
            error: true
        }

    const emailCase = z.string().email().safeParse(email)

    if (!emailCase.success)
        return {
            message: 'Email nuk është i vlefshëm!',
            error: true
        }

    const maxLengthCase = z.string().max(256).safeParse(email)

    if (!maxLengthCase.success)
        return {
            message: 'Email duhet të jetë më i shkurtë se 256 karaktere!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default EmailValidation