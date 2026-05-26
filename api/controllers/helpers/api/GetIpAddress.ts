import type { Context } from 'hono'

const GetIpAddress = (c: Context): string | null => {
    const forwarded = c.req.header('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()

    const realIp = c.req.header('x-real-ip')
    if (realIp) return realIp

    return null
}

export default GetIpAddress