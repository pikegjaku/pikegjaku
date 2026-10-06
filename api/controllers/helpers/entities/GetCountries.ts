import type { CountryInterface } from '@/ts'

import { env } from 'cloudflare:workers'
import { Find } from '@/controllers/libs/d1'
import { CountriesTable } from '@/data/tables'
import { CountryListSelector } from '@/data/constants/Selectors'
import { CACHE_TTL, ENVIRONMENTS } from '@/data/constants'

let cache: Array<CountryInterface> | null = null
let cachedAt = 0

const GetCountries = async (): Promise<Array<CountryInterface>> => {
    if (env.ENV === ENVIRONMENTS.PROD) {
        if (cache && Date.now() - cachedAt < CACHE_TTL) return cache

        const countries = await Find<CountryInterface>(CountriesTable, {
            columns: CountryListSelector,
            where: 'Deleted IS NOT 1',
            order: 'Name ASC'
        })

        cache = countries
        cachedAt = Date.now()

        return countries
    } else {
        const countries = await Find<CountryInterface>(CountriesTable, {
            columns: CountryListSelector,
            where: 'Deleted IS NOT 1',
            order: 'Name ASC'
        })

        return countries
    }
}

export default GetCountries