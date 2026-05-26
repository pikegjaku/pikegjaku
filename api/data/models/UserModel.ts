import type { UserInterface } from '@/ts'

import type { Model } from 'mongoose'
import { model } from 'mongoose'
import { UserStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let UserModel: Model<UserInterface>

try {
    UserModel = model<UserInterface>(MODELS.USER)
} catch {
    UserModel = model<UserInterface>(MODELS.USER, UserStructure)
}

export default UserModel