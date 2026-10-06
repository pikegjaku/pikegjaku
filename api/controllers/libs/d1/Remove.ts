import type { SqlFilter, TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'

const Remove = async (
    table: TableDefinition,
    filter: SqlFilter
): Promise<void> => {
    await env.DB.prepare(`DELETE FROM ${table.name} WHERE ${filter.where}`)
        .bind(...filter.params.map(Bind))
        .run()
}

export default Remove