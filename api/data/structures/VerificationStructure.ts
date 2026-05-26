import type { VerificationInterface, VerificationTypes } from '@/ts'

import { Schema } from 'mongoose'
import { MODELS, VERFICATIONS_TYPES } from '@/data/constants'

const VerificationStructure: Schema<VerificationInterface> = new Schema(
    {
        User: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: false,
            ref: MODELS.USER
        },
        Type: {
            type: String,
            required: false,
            unique: false,
            default: VERFICATIONS_TYPES.PHONE as VerificationTypes
        },
        Code: {
            type: Number,
            required: true,
            unique: true
        },
        Expired: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        Attempts: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        Used: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        Expires_At: {
            type: Date,
            required: true,
            unique: false
        },
        Generated_At: {
            type: Date,
            required: true,
            unique: false
        },
        Metadata: {
            MessageId: {
                type: String,
                required: false,
                unique: false
            }
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

export default VerificationStructure