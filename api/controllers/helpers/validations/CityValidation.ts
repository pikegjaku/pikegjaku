import type { ValidationReturnType } from '@/ts'

const CityValidation = (
    city: string | null,
    cities: Array<string>
): ValidationReturnType => {
    if (!city)
        return {
            message: 'Qyteti duhet të jetë i plotësuar!',
            error: true
        }

    if (!cities.includes(city))
        return {
            message: 'Qyteti duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default CityValidation