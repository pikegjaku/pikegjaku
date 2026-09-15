import type { CountryInterface } from '@/ts'

import { env } from '@goenvless/env/server'
import { CountryModel } from '@/data/models'
import { CountryListSelector } from '@/data/constants/Selectors'
import { CACHE_TTL, ENVIRONMENTS } from '@/data/constants'

let cache: Array<CountryInterface> | null = null
let cachedAt = 0

const GetCountries = async (): Promise<Array<CountryInterface>> => {
    if (env.ENV === ENVIRONMENTS.PROD) {
        if (cache && Date.now() - cachedAt < CACHE_TTL) return cache

        const countries = await CountryModel.find({ Deleted: { $ne: true } })
            .select(CountryListSelector)
            .sort({ Name: 1 })
            .lean()

        cache = countries
        cachedAt = Date.now()

        return countries
    } else {
        const countries = await CountryModel.find({ Deleted: { $ne: true } })
            .select(CountryListSelector)
            .sort({ Name: 1 })
            .lean()

        return countries
    }
}

export default GetCountries