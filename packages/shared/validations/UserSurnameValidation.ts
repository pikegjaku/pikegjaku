import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
export const UserSurnameValidation = (
    surname: string | null
): ValidationReturnType => {
    const minLengthCase = z.string().min(2).safeParse(surname)

    if (!minLengthCase.success)
        return {
            message: 'Surname must be longer than 2 characters!',
            error: true
        }

    const maxLengthCase = z.string().max(64).safeParse(surname)

    if (!maxLengthCase.success)
        return {
            message: 'Surname must be shorter than 64 characters!',
            error: true
        }

    const stringCase = z.string().safeParse(surname)

    if (!stringCase.success)
        return {
            message: 'Surname must be filled!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default UserSurnameValidation