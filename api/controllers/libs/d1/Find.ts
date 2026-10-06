import type { FindOptions, TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'
import MapRow from '@/controllers/libs/d1/MapRow'
import Populate from '@/controllers/libs/d1/Populate'

const Find = async <T>(
    table: TableDefinition,
    options: FindOptions = {}
): Promise<Array<T>> => {
    const { columns, where, params = [], order, skip, limit, references } =
        options

    const paged = limit !== undefined || skip !== undefined

    const bounds = [
        Math.abs(Math.trunc(Number(limit))) || -1,
        Math.max(Math.trunc(Number(skip)) || 0, 0)
    ]

    const statement = [
        `SELECT ${columns ? columns.join(', ') : '*'} FROM ${table.name}`,
        where ? `WHERE ${where}` : '',
        order ? `ORDER BY ${order}` : '',
        paged ? 'LIMIT ? OFFSET ?' : ''
    ]
        .filter(Boolean)
        .join(' ')

    const { results } = await env.DB.prepare(statement)
        .bind(...params.map(Bind), ...(paged ? bounds : []))
        .all<Record<string, unknown>>()

    const rows = results.map(
        (row) => MapRow<Record<string, unknown>>(table, row) as Record<string, unknown>
    )

    if (references) await Populate(rows, references)

    return rows as Array<T>
}

export default Find