import type { Context } from 'hono'
import type { BrowserTypes } from '@/ts'

const GetBrowser = (c: Context): BrowserTypes | null => {
    const browser = c.req.header('user-agent')

    if (browser) {
        if (browser.includes('Chrome')) return 'Chrome'
        else if (browser.includes('Firefox')) return 'Firefox'
        else if (browser.includes('Safari')) return 'Safari'
        else if (browser.includes('Edge')) return 'Edge'
        else return null
    } else return null
}

export default GetBrowser