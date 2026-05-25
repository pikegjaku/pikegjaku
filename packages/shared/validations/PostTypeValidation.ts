import type { PostTypes, ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import { POST_TYPES } from '@pikegjaku/shared/constants'

const PostGroupEnum = z.enum([POST_TYPES.BLOOD])

export const PostTypeValidation = (type: PostTypes): ValidationReturnType => {
    try {
        PostGroupEnum.parse(type)
    } catch {
        return {
            message: 'Lloji i postimit është i pasaktë!',
            error: true
        }
    }

    return {
        message: '',
        error: false
    }
}

export default PostTypeValidation