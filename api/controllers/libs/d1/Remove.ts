import type { SqlFilter, TableDefinition } from '@/ts'

import Database from '@/controllers/libs/d1/Database'
import Bind from '@/controllers/libs/d1/Bind'

const Remove = async (
    table: TableDefinition,
    filter: SqlFilter
): Promise<void> => {
    await Database().prepare(`DELETE FROM ${table.name} WHERE ${filter.where}`)
        .bind(...filter.params.map(Bind))
        .run()
}

export default Remove