import type { RouteDefinition } from '@/ts'

import {
    AuthUser,
    AuthVerify,
    CloseAccount,
    InvalidateCode,
    LogoutUser,
    UpdateUser,
    UserPosts,
    VerifyCode
} from '@/controllers/actions/users'

import {
    CreatePost,
    DeletePost,
    ListPost,
    ListPosts,
    UpdatePost
} from '@/controllers/actions/posts'

import { ListCities } from '@/controllers/actions/cities'
import { ListCountries } from '@/controllers/actions/countries'

import { JoinWaitlist } from '@/controllers/actions/generals'

import {
    CreateCenter,
    DeleteCenter,
    DeleteCity,
    DeleteCountry,
    DeletePost as AdminDeletePost,
    DeleteUser as AdminDeleteUser,
    DetailCenter,
    DetailCity,
    DetailCountry,
    DetailPost,
    DetailUser,
    ListCenters,
    ListCities as AdminListCities,
    ListCountries as AdminListCountries,
    ListPosts as AdminListPosts,
    ListUsers,
    Stats,
    UpdateCenter,
    UpdateCity,
    UpdateCountry,
    UpdatePost as AdminUpdatePost,
    UpdateUser as AdminUpdateUser
} from '@/controllers/actions/admin'

import {
    ADMIN_ROUTES,
    CITIES_ROUTES,
    COUNTRIES_ROUTES,
    GENERAL_ROUTES,
    GROUP_ROUTES,
    POSTS_ROUTES,
    USERS_ROUTES
} from '@/data/constants'

const ROUTES: RouteDefinition[] = [
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.AUTH_USER, auth: 'db', handler: AuthUser },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.INVALIDATE_CODE, auth: 'db', handler: InvalidateCode },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.VERIFY_CODE, auth: 'db', handler: VerifyCode },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.USER_POSTS, auth: 'user', handler: UserPosts },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.UPDATE_USER, auth: 'user', handler: UpdateUser },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.DELETE_USER, auth: 'user', handler: CloseAccount },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.LOGOUT_USER, auth: 'user', handler: LogoutUser },
    { group: GROUP_ROUTES.USERS, path: USERS_ROUTES.AUTH_USER_VERIFY, auth: 'user', handler: AuthVerify },

    { group: GROUP_ROUTES.POSTS, path: POSTS_ROUTES.CREATE_POST, auth: 'user', handler: CreatePost },
    { group: GROUP_ROUTES.POSTS, path: POSTS_ROUTES.DELETE_POST, auth: 'user', handler: DeletePost },
    { group: GROUP_ROUTES.POSTS, path: POSTS_ROUTES.LIST_POSTS, auth: 'user', handler: ListPosts },
    { group: GROUP_ROUTES.POSTS, path: POSTS_ROUTES.UPDATE_POST, auth: 'user', handler: UpdatePost },
    { group: GROUP_ROUTES.POSTS, path: POSTS_ROUTES.LIST_POST, auth: 'user', handler: ListPost },

    { group: GROUP_ROUTES.COUNTRIES, path: COUNTRIES_ROUTES.LIST_COUNTRIES, auth: 'db', handler: ListCountries },

    { group: GROUP_ROUTES.CITIES, path: CITIES_ROUTES.LIST_CITIES, auth: 'db', handler: ListCities },

    { group: GROUP_ROUTES.GENERALS, path: GENERAL_ROUTES.JOIN_WAITLIST, auth: 'public', handler: JoinWaitlist },

    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.STATS, auth: 'admin', handler: Stats },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.LIST_USERS, auth: 'admin', handler: ListUsers },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DETAIL_USER, auth: 'admin', handler: DetailUser },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.LIST_POSTS, auth: 'admin', handler: AdminListPosts },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DETAIL_POST, auth: 'admin', handler: DetailPost },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.LIST_CITIES, auth: 'admin', handler: AdminListCities },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DETAIL_CITY, auth: 'admin', handler: DetailCity },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.LIST_COUNTRIES, auth: 'admin', handler: AdminListCountries },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DETAIL_COUNTRY, auth: 'admin', handler: DetailCountry },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.LIST_CENTERS, auth: 'admin', handler: ListCenters },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DETAIL_CENTER, auth: 'admin', handler: DetailCenter },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.UPDATE_USER, auth: 'admin', handler: AdminUpdateUser },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.UPDATE_COUNTRY, auth: 'admin', handler: UpdateCountry },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.UPDATE_CITY, auth: 'admin', handler: UpdateCity },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.UPDATE_POST, auth: 'admin', handler: AdminUpdatePost },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.UPDATE_CENTER, auth: 'admin', handler: UpdateCenter },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DELETE_USER, auth: 'admin', handler: AdminDeleteUser },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DELETE_POST, auth: 'admin', handler: AdminDeletePost },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DELETE_CITY, auth: 'admin', handler: DeleteCity },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DELETE_COUNTRY, auth: 'admin', handler: DeleteCountry },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.DELETE_CENTER, auth: 'admin', handler: DeleteCenter },
    { group: GROUP_ROUTES.ADMIN, path: ADMIN_ROUTES.CREATE_CENTER, auth: 'admin', handler: CreateCenter }
]

export default ROUTES