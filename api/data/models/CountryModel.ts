import type { CountryInterface } from '@/ts'

import type { Model } from 'mongoose'
import { model } from 'mongoose'
import { CountryStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let CountryModel: Model<CountryInterface>

try {
    CountryModel = model<CountryInterface>(MODELS.COUNTRY)
} catch {
    CountryModel = model<CountryInterface>(MODELS.COUNTRY, CountryStructure)
}

export default CountryModel