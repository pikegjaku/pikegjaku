import type { ValidationReturnType } from '@/ts'

const CountryValidation = (
    country: string,
    countries: Array<string>
): ValidationReturnType => {
    if (!country)
        return {
            message: 'Shteti duhet të jetë i plotësuar!',
            error: true
        }

    if (!countries.includes(country))
        return {
            message: 'Shteti duhet të jetë i plotësuar!',
            error: true
        }

    return {
        message: '',
        error: false
    }
}

export default CountryValidation