// Generals
export const PORT = process.env.PORT as string
export const HOST = process.env.HOST as string
export const ORIGINS = process.env.ORIGINS as string
export const ENV = process.env.ENV as string

// Mongo
export const MONGO_URI = process.env.MONGO_URI as string

// JWT
export const AUTH_ACCESS_TOKEN_SECRET = process.env
    .AUTH_ACCESS_TOKEN_SECRET as string
export const AUTH_REFRESH_TOKEN_SECRET = process.env
    .AUTH_REFRESH_TOKEN_SECRET as string

// Cloudflare
export const CLOUDFLARE_TOKEN_VALUE = process.env
    .CLOUDFLARE_TOKEN_VALUE as string
export const CLOUDFLARE_ACCESS_KEY_ID = process.env
    .CLOUDFLARE_ACCESS_KEY_ID as string
export const CLOUDFLARE_SECRET_ACCESS_KEY = process.env
    .CLOUDFLARE_SECRET_ACCESS_KEY as string
export const CLOUDFLARE_S3_EU_ENDPOINT = process.env
    .CLOUDFLARE_S3_EU_ENDPOINT as string

// Sent
export const SENT_API_KEY = process.env.SENT_API_KEY as string
export const SENT_TEMPLATE_ID = process.env.SENT_TEMPLATE_ID as string

// Resend
export const RESEND_API_KEY = process.env.RESEND_API_KEY as string
export const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID as string