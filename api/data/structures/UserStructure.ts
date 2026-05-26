import type { UserInterface } from '@/ts'

import { Schema } from 'mongoose'
import { MODELS, USER_ROLES } from '@/data/constants'

const UserStructure: Schema<UserInterface> = new Schema(
    {
        Name: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Surname: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Phone: {
            type: String,
            required: true,
            unique: true
        },
        PhoneCountryCode: {
            type: String,
            required: false,
            unique: false,
            default: '+383'
        },
        Avatar: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        BloodGroup: {
            type: String,
            required: false,
            unique: false,
            default: null
        },
        Role: {
            type: String,
            required: false,
            unique: false,
            default: USER_ROLES.ADMIN
        },
        ProfileCompleted: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        CompletedRegistration: {
            type: Boolean,
            required: false,
            unique: false,
            default: false
        },
        Visits: {
            type: Number,
            required: false,
            unique: false,
            default: 1
        },
        Posts: {
            type: Number,
            required: false,
            unique: false,
            default: 0
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
        Last_Active: {
            type: Date,
            required: true,
            unique: false
        },
        Created_At: {
            type: Date,
            required: true,
            unique: false
        },
        Updated_At: {
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

export default UserStructure