import type { PostTypes, ValidationReturnType } from '@pikegjaku/shared/ts'

import { z } from 'zod'
const CountryCodeValidation = (type: PostTypes): ValidationReturnType => {
    const cityName = z.string()
    const lengthCase = cityName.min(2)

    try {
        cityName.parse(type)
    } catch {
        return {
            message: 'Kodi i shtetit duhet të jetë i plotësuar!',
            error: true
        }
    }

    try {
        lengthCase.parse(type)
    } catch {
        return {
            message: 'Kodi i shtetit duhet të jetë i plotësuar!',
            error: true
        }
    }

    return {
        message: '',
        error: false
    }
}

export default CountryCodeValidation