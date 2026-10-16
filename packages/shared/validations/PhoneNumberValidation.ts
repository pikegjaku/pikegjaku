import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import VALIDATION_LIMITS from '@pikegjaku/shared/validations/ValidationLimits'

const PhoneNumberValidation = (
    number: string | null,
    countryCode: string = 'XK'
): ValidationReturnType => {
    const phone = number?.toString()
    const length =
        Object.entries(VALIDATION_LIMITS.PHONE).find(
            ([country]) => country === countryCode
        )?.[1] ?? VALIDATION_LIMITS.PHONE.XK

    const stringCase = z.string().safeParse(phone)

    if (!stringCase.success)
        return {
            message: 'Numri i telefonit duhet të jetë i plotësuar!',
            error: true
        }

    const lengthCase = z.string().length(length).safeParse(phone)

    if (!lengthCase.success)
        return {
            message: `Numri i telefonit duhet të ketë ${length} shifra!`,
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default PhoneNumberValidation