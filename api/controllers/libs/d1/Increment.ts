import type { TableDefinition } from '@/ts'

import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'
import ToColumn from '@/controllers/libs/d1/ToColumn'

const Increment = async (
    table: TableDefinition,
    id: unknown,
    column: string,
    amount: number,
    values: Record<string, unknown> = {}
): Promise<void> => {
    const columns = Object.keys(values).filter(
        (key) => key in table.columns && key !== '_id' && values[key] !== undefined
    )

    const assignments = [
        `${column} = COALESCE(${column}, 0) + ?`,
        ...columns.map((key) => `${key} = ?`)
    ]

    await env.DB.prepare(
        `UPDATE ${table.name} SET ${assignments.join(', ')} WHERE _id = ?`
    )
        .bind(
            amount,
            ...columns.map((key) => ToColumn(table.columns[key], values[key])),
            Bind(id)
        )
        .run()
}

export default Increment