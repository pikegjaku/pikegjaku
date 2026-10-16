import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import VALIDATION_LIMITS from '@pikegjaku/shared/validations/ValidationLimits'

const UserSurnameValidation = (
    surname: string | null
): ValidationReturnType => {
    const minLengthCase = z
        .string()
        .min(VALIDATION_LIMITS.USER_SURNAME.MIN)
        .safeParse(surname)

    if (!minLengthCase.success)
        return {
            message: `Mbiemri duhet të ketë të paktën ${VALIDATION_LIMITS.USER_SURNAME.MIN} shkronja!`,
            error: true
        }

    const maxLengthCase = z
        .string()
        .max(VALIDATION_LIMITS.USER_SURNAME.MAX)
        .safeParse(surname)

    if (!maxLengthCase.success)
        return {
            message: `Mbiemri duhet të ketë më së shumti ${VALIDATION_LIMITS.USER_SURNAME.MAX} shkronja!`,
            error: true
        }

    const stringCase = z.string().safeParse(surname)

    if (!stringCase.success)
        return {
            message: 'Mbiemri duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default UserSurnameValidation
