import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import VALIDATION_LIMITS from '@pikegjaku/shared/validations/ValidationLimits'

const PostDescriptionValidation = (
    description: string
): ValidationReturnType => {
    const minLengthCase = z
        .string()
        .min(VALIDATION_LIMITS.POST_DESCRIPTION.MIN)
        .safeParse(description)

    if (!minLengthCase.success)
        return {
            message: `Përshkrimi duhet të ketë të paktën ${VALIDATION_LIMITS.POST_DESCRIPTION.MIN} karaktere!`,
            error: true
        }

    const maxLengthCase = z
        .string()
        .max(VALIDATION_LIMITS.POST_DESCRIPTION.MAX)
        .safeParse(description)

    if (!maxLengthCase.success)
        return {
            message: `Përshkrimi duhet të ketë më së shumti ${VALIDATION_LIMITS.POST_DESCRIPTION.MAX} karaktere!`,
            error: true
        }

    const stringCase = z.string().safeParse(description)

    if (!stringCase.success)
        return {
            message: 'Përshkrimi duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default PostDescriptionValidation
