import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const UserNameValidation = (name: string | null): ValidationReturnType => {
    const minLengthCase = z.string().min(2).safeParse(name)

    if (!minLengthCase.success)
        return {
            message: 'Name must be longer than 2 characters!',
            error: true
        }

    const maxLengthCase = z.string().max(64).safeParse(name)

    if (!maxLengthCase.success)
        return {
            message: 'Name must be shorter than 64 characters!',
            error: true
        }

    const stringCase = z.string().safeParse(name)

    if (!stringCase.success)
        return {
            message: 'Name must be filled!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default UserNameValidation