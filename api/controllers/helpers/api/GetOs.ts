import type { Context } from 'hono'
import type { OsTypes } from '@/ts'

const GetOs = (c: Context): OsTypes | null => {
    const user_agent = c.req.header('user-agent')

    if (user_agent) {
        if (user_agent.includes('Windows')) return 'Windows'
        else if (user_agent.includes('Linux')) return 'Linux'
        else if (user_agent.includes('Mac')) return 'Mac'
        else return null
    } else return null
}

export default GetOs