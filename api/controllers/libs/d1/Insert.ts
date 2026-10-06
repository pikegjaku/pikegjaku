import type { TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import MapRow from '@/controllers/libs/d1/MapRow'
import NewId from '@/controllers/libs/d1/NewId'
import ToColumn from '@/controllers/libs/d1/ToColumn'

const Insert = async <T>(
    table: TableDefinition,
    values: Record<string, unknown>,
    conflict?: string
): Promise<T | null> => {
    const record: Record<string, unknown> = {
        ...values,
        _id: values._id ?? NewId()
    }

    const columns = Object.keys(record).filter(
        (column) => column in table.columns && record[column] !== undefined
    )

    const row = await env.DB.prepare(
        `INSERT INTO ${table.name} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})${conflict ? ` ON CONFLICT (${conflict}) DO NOTHING` : ''} RETURNING *`
    )
        .bind(
            ...columns.map((column) =>
                ToColumn(table.columns[column], record[column])
            )
        )
        .first<Record<string, unknown>>()

    return MapRow<T>(table, row)
}

export default Insert