import type { PostInterface } from '@/ts'

import { Schema } from 'mongoose'

import { MODELS, POST_STATUSES, POST_TYPES } from '@/data/constants'

const PostStructure: Schema<PostInterface> = new Schema(
    {
        Title: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Description: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Type: {
            type: String,
            required: true,
            unique: false,
            default: POST_TYPES.BLOOD
        },
        BloodGroup: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Urgent: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        Status: {
            type: String,
            required: false,
            unique: false,
            default: POST_STATUSES.APPROVED
        },
        Reach: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        User: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: false,
            ref: MODELS.USER
        },
        Country: {
            type: Schema.Types.ObjectId,
            required: false,
            unique: false,
            ref: MODELS.COUNTRY,
            default: null
        },
        City: {
            type: Schema.Types.ObjectId,
            required: false,
            unique: false,
            ref: MODELS.CITY,
            default: null
        },
        Views: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        Deleted: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        Deleted_At: {
            type: Date,
            required: false,
            unique: false,
            default: null
        },
        Created_At: {
            type: Date,
            required: false,
            unique: false
        },
        Updated_At: {
            type: Date,
            required: false,
            unique: false
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

export default PostStructure