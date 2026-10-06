import type { CityInterface } from '@/ts'

import { env } from 'cloudflare:workers'
import { Find } from '@/controllers/libs/d1'
import { CitiesTable } from '@/data/tables'
import { CityListSelector } from '@/data/constants/Selectors'
import { CACHE_TTL, ENVIRONMENTS } from '@/data/constants'

let cache: Array<CityInterface> | null = null
let cachedAt = 0

const GetCities = async (): Promise<Array<CityInterface>> => {
    if (env.ENV === ENVIRONMENTS.PROD) {
        if (cache && Date.now() - cachedAt < CACHE_TTL) return cache

        const cities = await Find<CityInterface>(CitiesTable, {
            columns: CityListSelector,
            where: 'Deleted IS NOT 1',
            order: 'Name ASC'
        })

        cache = cities
        cachedAt = Date.now()

        return cities
    } else {
        const cities = await Find<CityInterface>(CitiesTable, {
            columns: CityListSelector,
            where: 'Deleted IS NOT 1',
            order: 'Name ASC'
        })

        return cities
    }
}

export default GetCities