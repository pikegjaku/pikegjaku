import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import VALIDATION_LIMITS from '@pikegjaku/shared/validations/ValidationLimits'

const PostTitleValidation = (name: string): ValidationReturnType => {
    const minLengthCase = z
        .string()
        .min(VALIDATION_LIMITS.POST_TITLE.MIN)
        .safeParse(name)

    if (!minLengthCase.success)
        return {
            message: `Titulli duhet të ketë të paktën ${VALIDATION_LIMITS.POST_TITLE.MIN} karaktere!`,
            error: true
        }

    const maxLengthCase = z
        .string()
        .max(VALIDATION_LIMITS.POST_TITLE.MAX)
        .safeParse(name)

    if (!maxLengthCase.success)
        return {
            message: `Titulli duhet të ketë më së shumti ${VALIDATION_LIMITS.POST_TITLE.MAX} karaktere!`,
            error: true
        }

    const stringCase = z.string().safeParse(name)

    if (!stringCase.success)
        return {
            message: 'Titulli duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default PostTitleValidation
