import type { TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'
import ToColumn from '@/controllers/libs/d1/ToColumn'

const Update = async (
    table: TableDefinition,
    id: unknown,
    values: Record<string, unknown>
): Promise<void> => {
    const columns = Object.keys(values).filter(
        (column) =>
            column in table.columns &&
            column !== '_id' &&
            values[column] !== undefined
    )

    if (columns.length === 0) return

    await env.DB.prepare(
        `UPDATE ${table.name} SET ${columns.map((column) => `${column} = ?`).join(', ')} WHERE _id = ?`
    )
        .bind(
            ...columns.map((column) =>
                ToColumn(table.columns[column], values[column])
            ),
            Bind(id)
        )
        .run()
}

export default Update