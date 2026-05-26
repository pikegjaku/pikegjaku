import type { CountryInterface } from '@/ts'

import { Schema } from 'mongoose'

const CountryStructure: Schema<CountryInterface> = new Schema(
    {
        Name: {
            type: String,
            required: true,
            unique: true
        },
        Code: {
            type: Number,
            required: true,
            unique: true
        },
        Cities: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        Posts: {
            type: Number,
            required: false,
            unique: false,
            default: 0
        },
        Users: {
            type: Number,
            required: false,
            unique: false,
            default: 0
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

export default CountryStructure