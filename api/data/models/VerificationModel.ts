import type { VerificationInterface } from '@/ts'

import type { Model } from 'mongoose'
import { model } from 'mongoose'
import { VerificationStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let VerificationModel: Model<VerificationInterface>

try {
    VerificationModel = model<VerificationInterface>(MODELS.VERIFICATION)
} catch {
    VerificationModel = model<VerificationInterface>(
        MODELS.VERIFICATION,
        VerificationStructure
    )
}

export default VerificationModel