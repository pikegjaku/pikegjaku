import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const PostTitleValidation = (name: string): ValidationReturnType => {
    const minLengthCase = z.string().min(12).safeParse(name)

    if (!minLengthCase.success)
        return {
            message: 'Titulli duhet të jetë më i gjatë se 12 karaktere!',
            error: true
        }

    const maxLengthCase = z.string().max(64).safeParse(name)

    if (!maxLengthCase.success)
        return {
            message: 'Titulli duhet të jetë më i shkurtë se 64 karaktere!',
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