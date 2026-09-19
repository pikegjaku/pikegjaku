export const MAX_ENTITY_ITEMS = 50
export const DEFAULT_TEST_NUMBER = '00000000'
export const MAX_AVATAR_BYTES = 10 * 1024 * 1024
export const DATA_URI_PATTERN = /^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/
export const CACHE_TTL = 3600 * 1000

export const RESERVED_EMAIL_DOMAINS = [
    'example.com',
    'example.net',
    'example.org',
    'test',
    'invalid',
    'localhost'
]

export const MONGO_OPTIONS = {
    maxPoolSize: 100,
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
    waitQueueTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    compressors: ['zlib' as const],
    autoIndex: false
}

export const BRAND = {
    RED: '#f44336',
    BLACK: '#000000',
    SURFACE: '#0a0a0a',
    BORDER: '#1f1f1f',
    TEXT: '#ffffff',
    TEXT_MUTED: '#8c8c8c',
    SITE: 'https://pikegjaku.com',
    HEADING_FONT: "'Host Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    BODY_FONT: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
}

export const WAITLIST_DATE_FORMAT: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Belgrade'
}

export const LOGO_PIXELS: [number, number][] = [
    [3, 0],
    [2, 1], [3, 1], [4, 1],
    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5],
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6],
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7],
    [2, 8], [3, 8], [4, 8]
]

export const EXTERNAL_APIS = {
    SENT: {
        MESSAGES: 'https://api.sent.dm/v3/messages'
    }
}

export const GROUP_ROUTES = {
    USERS: '/users',
    POSTS: '/posts',
    COUNTRIES: '/countries',
    CITIES: '/cities',
    VERIFICATIONS: '/verifications',
    GENERALS: '/generals',
    ADMIN: '/admin'
}

export const ADMIN_ROUTES = {
    STATS: '/stats',
    LIST_USERS: '/list-users',
    DETAIL_USER: '/detail-user',
    LIST_POSTS: '/list-posts',
    DETAIL_POST: '/detail-post',
    LIST_CITIES: '/list-cities',
    DETAIL_CITY: '/detail-city',
    LIST_COUNTRIES: '/list-countries',
    DETAIL_COUNTRY: '/detail-country',
    LIST_CENTERS: '/list-centers',
    DETAIL_CENTER: '/detail-center',
    UPDATE_USER: '/update-user',
    UPDATE_COUNTRY: '/update-country',
    UPDATE_CITY: '/update-city',
    UPDATE_POST: '/update-post',
    UPDATE_CENTER: '/update-center',
    DELETE_USER: '/delete-user',
    DELETE_POST: '/delete-post',
    DELETE_CITY: '/delete-city',
    DELETE_COUNTRY: '/delete-country',
    DELETE_CENTER: '/delete-center',
    CREATE_CENTER: '/create-center'
}

export const POSTS_ROUTES = {
    CREATE_POST: '/create-post',
    DELETE_POST: '/delete-post',
    LIST_POSTS: '/list-posts',
    UPDATE_POST: '/update-post',
    LIST_POST: '/list-post'
}

export const USERS_ROUTES = {
    AUTH_USER: '/auth-user',
    VERIFY_CODE: '/verify-code',
    INVALIDATE_CODE: '/invalidate-code',
    AUTH_USER_VERIFY: '/auth-user-verify',
    USER_POSTS: '/list-user-posts',
    UPDATE_USER: '/update-user',
    DELETE_USER: '/close-account',
    LOGOUT_USER: '/logout-user'
}

export const CITIES_ROUTES = {
    LIST_CITIES: '/list-cities'
}

export const COUNTRIES_ROUTES = {
    LIST_COUNTRIES: '/list-countries'
}

export const GENERAL_ROUTES = {
    JOIN_WAITLIST: '/join-waitlist'
}

export const MODELS = {
    USER: 'User',
    POST: 'Post',
    VERIFICATION: 'Verification',
    COUNTRY: 'Country',
    CENTER: 'Center',
    CITY: 'City',
    WAITLIST: 'Waitlist'
}

export const POPULATE = {
    USER: 'User',
    POST: 'Post',
    VERIFICATION: 'Verification',
    COUNTRY: 'Country',
    CITY: 'City'
}

export const VERFICATIONS_TYPES = {
    PHONE: 'phone'
}

export const COOKIE_ACCESSORS = {
    ACCESS: 'a_token',
    REFRESH: 'r_token'
}

export const ENVIRONMENTS = {
    LOCAL: 'local',
    PROD: 'prod'
}

export const CLOUDFLARE_BUCKETS = {
    CDN: 'pikegjaku-cdn'
}

export const CLOUDFLARE_CDN_PATHS = {
    AVATARS: 'avatars'
}

export const FILE_EXTENSIONS = {
    WEBP: 'webp'
}

export const FILE_TYPES = {
    IMAGE: {
        WEBP: 'image/webp'
    }
}

export const OS_TYPES = {
    WINDOWS: 'Windows',
    LINUX: 'Linux',
    MAC: 'Mac'
}

export const BROWSER_TYPES = {
    CHROME: 'Chrome',
    FIREFOX: 'Firefox',
    SAFARI: 'Safari',
    EDGE: 'Edge'
}