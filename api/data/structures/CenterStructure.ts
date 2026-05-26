import type { CenterInterface } from '@/ts'

import { Schema } from 'mongoose'
import { MODELS } from '@/data/constants'

const CenterStructure: Schema<CenterInterface> = new Schema(
    {
        Name: {
            type: String,
            required: true,
            unique: false
        },
        Phone: {
            type: String,
            required: true,
            unique: false
        },
        Address: {
            type: String,
            required: true,
            unique: false
        },
        City: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: false,
            ref: MODELS.CITY
        },
        Country: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: false,
            ref: MODELS.COUNTRY
        },
        Location: {
            Latitude: {
                type: Number,
                required: false,
                unique: false
            },
            Longitude: {
                type: Number,
                required: false,
                unique: false
            }
        },
        Active: {
            type: Boolean,
            required: false,
            unique: false,
            default: true
        },
        Created_At: {
            type: Date,
            required: true,
            unique: false
        },
        Updated_At: {
            type: Date,
            required: true,
            unique: false
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
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

export default CenterStructure