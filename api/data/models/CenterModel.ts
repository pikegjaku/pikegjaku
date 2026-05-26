import type { CenterInterface } from '@/ts'
import type { Model } from 'mongoose'

import { model } from 'mongoose'
import { CenterStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let CenterModel: Model<CenterInterface>

try {
    CenterModel = model<CenterInterface>(MODELS.CENTER)
} 

catch {
    CenterModel = model<CenterInterface>(MODELS.CENTER, CenterStructure)
}

export default CenterModel