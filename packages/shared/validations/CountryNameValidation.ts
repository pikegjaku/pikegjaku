import type { PostTypes, ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const CountryNameValidation = (type: PostTypes): ValidationReturnType => {
    const countryName = z.string()
    const minLengthCase = countryName.min(2)
    const maxLengthCase = countryName.max(64)

    try {
        countryName.parse(type)
    } catch {
        return {
            message: 'Emri i shtetit duhet të jetë i plotësuar!',
            error: true
        }
    }

    try {
        minLengthCase.parse(type)
    } catch {
        return {
            message: 'Emri i shtetit duhet të jetë më i gjatë se 2 karaktere!',
            error: true
        }
    }

    try {
        maxLengthCase.parse(type)
    } catch {
        return {
            message:
                'Emri i shtetit duhet të jetë më i shkurtë se 64 karaktere!',
            error: true
        }
    }

    return {
        message: '',
        error: false
    }
}

export default CountryNameValidation