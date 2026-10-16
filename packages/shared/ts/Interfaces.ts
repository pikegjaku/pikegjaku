import type {
    BloodGroupTypes,
    PostTypes,
    PostStatusTypes,
    UserRoleTypes
} from '@pikegjaku/shared/ts/Types'

export interface CountryInterface {
    _id: string
    Name: string
    Code: number
    Posts: number
    Users: number
    Cities: number
    Deleted: boolean
    Deleted_At: Date | null
    Created_At: Date
    Updated_At: Date
}

export interface CityInterface {
    _id: string
    Name: string
    Value: string
    Posts: number
    Users: number
    Country: CountryInterface
    Deleted: boolean
    Deleted_At: Date | null
    Created_At: Date
    Updated_At: Date
}

export interface CenterInterface {
    _id: string
    Name: string
    Phone: string
    Address: string
    City: CityInterface
    Country: CountryInterface
    Location: {
        Latitude: number
        Longitude: number
    }
    Active: boolean
    Deleted: boolean
    Deleted_At: Date | null
    Created_At: Date
    Updated_At: Date
}

export interface BaseUserInterface {
    _id: string
    Name: string
    Surname: string
    Avatar: string
    Phone: string
    PhoneCountryCode: string
    Country: CountryInterface
    City: CityInterface
    ProfileCompleted: boolean
    CompletedRegistration: boolean
    Posts: number
    Visits: number
    BloodGroup: BloodGroupTypes
    Role: UserRoleTypes
    Deleted: boolean
    Deleted_At: Date | null
    Last_Active: Date
    Created_At: Date
    Updated_At: Date | null
}

export interface BasePostInterface {
    _id: string
    Title: string
    Description: string
    User: BaseUserInterface
    Type: PostTypes
    BloodGroup: BloodGroupTypes
    Status: PostStatusTypes
    City: CityInterface
    Country: CountryInterface
    Urgent: boolean
    Reach: number
    Views: number
    Deleted: boolean
    Deleted_At: Date | null
    Created_At: Date
    Updated_At: Date
}