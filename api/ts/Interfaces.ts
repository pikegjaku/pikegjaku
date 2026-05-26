import type { Handler } from 'hono'

import type {
    BaseUserInterface,
    BasePostInterface,
    CenterInterface,
    CountryInterface,
    CityInterface
} from '@pikegjaku/shared/ts'

import type {
    RouteAuthLevel,
    VerificationTypes
} from '@/ts'

export interface RouteDefinition {
    group: string
    path: string
    auth: RouteAuthLevel
    handler: Handler
}

export interface UserInterface extends BaseUserInterface {
    String: number
}

export interface PostInterface extends BasePostInterface {
    User: UserInterface
}

export { CenterInterface, CountryInterface, CityInterface }

export interface VerificationInterface {
    _id: string
    User: UserInterface
    Type: VerificationTypes
    Code: number
    Expired: boolean
    Used: boolean
    Attempts: number
    Expires_At: Date
    Generated_At: Date
    Metadata: {
        MessageId: string
    }
}