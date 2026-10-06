import type { CountRow, SqlFilter, TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'

const Count = async (
    table: TableDefinition,
    filter?: SqlFilter
): Promise<number> => {
    const row = await env.DB.prepare(
        `SELECT COUNT(*) AS count FROM ${table.name}${filter?.where ? ` WHERE ${filter.where}` : ''}`
    )
        .bind(...(filter?.params ?? []).map(Bind))
        .first<CountRow>()

    return row?.count ?? 0
}

export default Count