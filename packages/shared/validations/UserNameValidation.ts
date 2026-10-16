import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import VALIDATION_LIMITS from '@pikegjaku/shared/validations/ValidationLimits'

const UserNameValidation = (name: string | null): ValidationReturnType => {
    const minLengthCase = z
        .string()
        .min(VALIDATION_LIMITS.USER_NAME.MIN)
        .safeParse(name)

    if (!minLengthCase.success)
        return {
            message: `Emri duhet të ketë të paktën ${VALIDATION_LIMITS.USER_NAME.MIN} shkronja!`,
            error: true
        }

    const maxLengthCase = z
        .string()
        .max(VALIDATION_LIMITS.USER_NAME.MAX)
        .safeParse(name)

    if (!maxLengthCase.success)
        return {
            message: `Emri duhet të ketë më së shumti ${VALIDATION_LIMITS.USER_NAME.MAX} shkronja!`,
            error: true
        }

    const stringCase = z.string().safeParse(name)

    if (!stringCase.success)
        return {
            message: 'Emri duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default UserNameValidation
