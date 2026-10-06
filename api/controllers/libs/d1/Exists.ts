import type { SqlFilter, TableDefinition } from '@/ts'

import Database from '@/controllers/libs/d1/Database'
import Bind from '@/controllers/libs/d1/Bind'

const Exists = async (
    table: TableDefinition,
    filter: SqlFilter
): Promise<boolean> => {
    const row = await Database().prepare(
        `SELECT 1 FROM ${table.name} WHERE ${filter.where} LIMIT 1`
    )
        .bind(...filter.params.map(Bind))
        .first()

    return row !== null
}

export default Exists