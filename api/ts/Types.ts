import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

import type { PostTypes } from '@pikegjaku/shared/ts'

import type { UserInterface } from '@/ts'

import type { VERFICATIONS_TYPES } from '@/data/constants'

export type RouteAuthLevel = 'public' | 'user' | 'admin'

export type VerificationTypes =
    (typeof VERFICATIONS_TYPES)[keyof typeof VERFICATIONS_TYPES]

export type ColumnKind = 'text' | 'number' | 'boolean' | 'date' | 'json'

export type SqlValue = string | number | null

export type CountRow = {
    count: number
}

export type TableDefinition = {
    name: string
    columns: Record<string, ColumnKind>
}

export type TableReferences = Record<string, TableDefinition>

export type SqlFilter = {
    where: string
    params: Array<unknown>
}

export type FindOptions = {
    columns?: Array<string>
    where?: string
    params?: Array<unknown>
    order?: string
    skip?: unknown
    limit?: unknown
    references?: TableReferences
}

export type TimelineRow = {
    day: string | null
    count: number
}

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

export type PostListFilterFunctionPropTypes = {
    user: UserInterface
    term: string | null
    city: null | string
    same_blood_group: boolean
    mode: PostTypes
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

export type UploadToBucketFunctionProps = {
    path: string
    file: ArrayBuffer
    type: string
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

export type EmailLayoutProps = {
    preheader: string
    heading: string
    body: string
}

export type NotificationTemplateProps = {
    email: string
    total: number
    date: string
}