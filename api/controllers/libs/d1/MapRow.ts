import type { TableDefinition } from '@/ts'

import FromColumn from '@/controllers/libs/d1/FromColumn'

const MapRow = <T>(
    table: TableDefinition,
    row: Record<string, unknown> | null
): T | null => {
    if (!row) return null

    return Object.fromEntries(
        Object.entries(row).map(([column, value]) => [
            column,
            FromColumn(table.columns[column], value)
        ])
    ) as T
}

export default MapRow