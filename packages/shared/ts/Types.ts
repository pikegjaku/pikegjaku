import type {
    BLOOD_GROUPS,
    POST_TYPES,
    POST_STATUSES,
    NOTIFICATION_TYPES,
    USER_NOTIFICATION_TYPES,
    USER_ROLES
} from '@pikegjaku/shared/constants'

export type PostTypes = (typeof POST_TYPES)[keyof typeof POST_TYPES]
export type BloodGroupTypes = (typeof BLOOD_GROUPS)[keyof typeof BLOOD_GROUPS]
export type PostStatusTypes = (typeof POST_STATUSES)[keyof typeof POST_STATUSES]
export type NotificationTypes =
    (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]
export type UserNotificationTypes =
    (typeof USER_NOTIFICATION_TYPES)[keyof typeof USER_NOTIFICATION_TYPES]
export type UserRoleTypes = (typeof USER_ROLES)[keyof typeof USER_ROLES]
export type ValidationReturnType = { message: string; error: boolean }
export type CodeInputValueTypes = { [key: string]: string }