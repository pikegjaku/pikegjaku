import type { WaitlistInterface } from '@/ts'

import type { Model } from 'mongoose'
import { model } from 'mongoose'
import { WaitlistStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let WaitlistModel: Model<WaitlistInterface>

try {
    WaitlistModel = model<WaitlistInterface>(MODELS.WAITLIST)
} catch {
    WaitlistModel = model<WaitlistInterface>(MODELS.WAITLIST, WaitlistStructure)
}

export default WaitlistModel