import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
export const PostDescriptionValidation = (
    description: string
): ValidationReturnType => {
    const minLengthCase = z.string().min(32).safeParse(description)

    if (!minLengthCase.success)
        return {
            message: 'Përshkrimi duhet të jetë më i gjatë se 32 karaktere!',
            error: true
        }

    const maxLengthCase = z.string().max(512).safeParse(description)

    if (!maxLengthCase.success)
        return {
            message: 'Përshkrimi duhet të jetë më i shkurtë se 512 karaktere!',
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