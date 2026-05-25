import type { PostTypes, ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
export const CityNameValidation = (type: PostTypes): ValidationReturnType => {
    const cityName = z.string()
    const minLengthCase = cityName.min(2)
    const maxLengthCase = cityName.max(64)

    try {
        cityName.parse(type)
    } catch {
        return {
            message: 'Emri i qytetit duhet të jetë i plotësuar!',
            error: true
        }
    }

    try {
        minLengthCase.parse(type)
    } catch {
        return {
            message: 'Emri i qytetit duhet të jetë më i gjatë se 2 karaktere!',
            error: true
        }
    }

    try {
        maxLengthCase.parse(type)
    } catch {
        return {
            message: 'Emri i qytetit duhet të jetë më i shkurtë se 64 karaktere!',
            error: true
        }
    }

    return {
        message: '',
        error: false
    }
}

export default CityNameValidation