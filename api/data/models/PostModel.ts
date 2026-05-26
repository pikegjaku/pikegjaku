import type { PostInterface } from '@/ts'

import type { Model } from 'mongoose'
import { model } from 'mongoose'
import { PostStructure } from '@/data/structures'
import { MODELS } from '@/data/constants'

let PostModel: Model<PostInterface>

try {
    PostModel = model<PostInterface>(MODELS.POST)
} catch {
    PostModel = model<PostInterface>(MODELS.POST, PostStructure)
}

export default PostModel