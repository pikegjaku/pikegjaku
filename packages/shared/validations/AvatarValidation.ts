import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const AvatarValidation = (avatar: string | null): ValidationReturnType => {
    const avatarCases = z.string().nullable()

    try {
        avatarCases.parse(avatar)

        return {
            message: '',
            error: false
        }
    } catch {
        return {
            message: 'Fotografia është e pasaktë!',
            error: true
        }
    }
}

export default AvatarValidation