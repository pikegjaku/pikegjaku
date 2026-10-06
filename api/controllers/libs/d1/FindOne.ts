import type { FindOptions, TableDefinition } from '@/ts'

import Find from '@/controllers/libs/d1/Find'

const FindOne = async <T>(
    table: TableDefinition,
    options: FindOptions
): Promise<T | null> => {
    const [row] = await Find<T>(table, { ...options, skip: 0, limit: 1 })

    return row ?? null
}

export default FindOne