import type { CityInterface } from '@/ts'

import { CityModel } from '@/data/models'
import { CityListSelector } from '@/data/constants/Selectors'
import { CACHE_TTL, ENV, ENVIRONMENTS } from '@/data/constants'

let cache: Array<CityInterface> | null = null
let cachedAt = 0

const GetCities = async (): Promise<Array<CityInterface>> => {
    if (ENV === ENVIRONMENTS.PROD) {
        if (cache && Date.now() - cachedAt < CACHE_TTL) return cache

        const cities = await CityModel.find({ Deleted: { $ne: true } })
            .select(CityListSelector)
            .sort({ Name: 1 })
            .lean()

        cache = cities
        cachedAt = Date.now()

        return cities
    } else {
        const cities = await CityModel.find({ Deleted: { $ne: true } })
            .select(CityListSelector)
            .sort({ Name: 1 })
            .lean()

        return cities
    }
}

export default GetCities