import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

import type {
    
    BloodGroupTypes,
    PostTypes,
    PostStatusTypes
} from '@pikegjaku/shared/ts'

import type {
    CityInterface,
    CountryInterface,
    UserInterface,
    PostInterface,
    VerificationInterface
} from '@/ts'

import type {
    BROWSER_TYPES,
    MODELS,
    OS_TYPES,
    VERFICATIONS_TYPES
} from '@/data/constants'

export type RouteAuthLevel = 'public' | 'db' | 'user' | 'admin'

export type VerificationTypes =
    (typeof VERFICATIONS_TYPES)[keyof typeof VERFICATIONS_TYPES]
export type ModelTypes = (typeof MODELS)[keyof typeof MODELS]
export type OsTypes = (typeof OS_TYPES)[keyof typeof OS_TYPES]
export type BrowserTypes = (typeof BROWSER_TYPES)[keyof typeof BROWSER_TYPES]

export type HttpResponderFunctionProps = {
    c: Context
    success: boolean
    message: string
    data: null | Array<object> | object | string | boolean
    code: StatusCode
}

export type AuthTokenVerifierFunctionResponseTypes = {
    code: 401 | 200 | 500
    userId: string | null
    token: string | null
    refresh: string | null
    message: string
}

export type EncodedTokenData = {
    userId: string
}

export type PostListFilterFunctionPropTypes = {
    user: UserInterface
    term: string | null
    city: null | string
    same_blood_group: boolean
    mode: PostTypes
}

export type PostsListFilterOptionTypes = {
    Status: PostStatusTypes
    City?: string
    BloodGroup?: BloodGroupTypes
    Type?: PostTypes
    Title?: {
        $regex: string
        $options: string
    }
    Deleted?: { $ne: boolean }
}

export type RequestResponseTypes = {
    success: boolean
    message: string
    data: null | Array<object> | object | string | boolean
    code: number
}

export type VerifyJwtTokenReturnType = {
    userId: string
}

export type Models =
    | CityInterface
    | CountryInterface
    | UserInterface
    | PostInterface
    | VerificationInterface

export type UploadToBucketFunctionProps = {
    bucket: string
    path: string
    file: Buffer
    type: string
    publicObject: boolean
}

export type SentMessagesResponse = {
    success?: boolean
    data?: {
        recipients?: { message_id?: string }[]
    }
}

export type HandleAvatarInput = {
    userId: string
    currentAvatar: string | null
    incomingAvatar: string | null | undefined
}

export type HandleAvatarResult =
    | { ok: true; changed: boolean; path: string | null }
    | { ok: false; code: StatusCode; message: string }