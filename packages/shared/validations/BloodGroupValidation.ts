import type { ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
import { BLOOD_GROUPS } from '@pikegjaku/shared/constants'

const BloodGroupEnum = z.enum([
    BLOOD_GROUPS.A_POSITIVE,
    BLOOD_GROUPS.A_NEGATIVE,
    BLOOD_GROUPS.B_POSITIVE,
    BLOOD_GROUPS.B_NEGATIVE,
    BLOOD_GROUPS.AB_POSITIVE,
    BLOOD_GROUPS.AB_NEGATIVE,
    BLOOD_GROUPS.O_POSITIVE,
    BLOOD_GROUPS.O_NEGATIVE
])

const BloodGroupValidation = (group: string | null): ValidationReturnType => {
    try {
        BloodGroupEnum.parse(group)
    } catch {
        return {
            message: 'Blood group type is invalid!',
            error: true
        }
    }

    return {
        message: '',
        error: false
    }
}

export default BloodGroupValidation