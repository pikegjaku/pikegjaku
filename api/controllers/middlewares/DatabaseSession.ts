import type { Context, Next } from 'hono'

import { env } from 'cloudflare:workers'
import { Store } from '@/controllers/libs/d1'
import { D1_BOOKMARK_HEADER, D1_BOOKMARK_PATTERN } from '@/data/constants'

const DatabaseSession = (replica: boolean) => async (c: Context, next: Next) => {
    const bookmark = c.req.header(D1_BOOKMARK_HEADER)
    const fallback = replica ? 'first-unconstrained' : 'first-primary'

    const session = env.DB.withSession(
        bookmark && D1_BOOKMARK_PATTERN.test(bookmark) ? bookmark : fallback
    )

    await Store.run(session, next)

    const latest = session.getBookmark()

    if (latest) c.res.headers.set(D1_BOOKMARK_HEADER, latest)
}

export default DatabaseSession