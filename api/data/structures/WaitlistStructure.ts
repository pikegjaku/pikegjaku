import type { WaitlistInterface } from '@/ts'

import { Schema } from 'mongoose'

const WaitlistStructure: Schema<WaitlistInterface> = new Schema(
    {
        Email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        Subscribed_At: {
            type: Date,
            required: true,
            unique: false
        },
        Metadata: {
            EmailId: {
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

export default WaitlistStructure