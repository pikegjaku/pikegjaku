import type { TableReferences } from '@/ts'

import Database from '@/controllers/libs/d1/Database'
import MapRow from '@/controllers/libs/d1/MapRow'
import { MAX_BOUND_PARAMETERS } from '@/data/constants'

const Populate = async (
    items: Array<Record<string, unknown>>,
    references: TableReferences
): Promise<void> => {
    await Promise.all(
        Object.entries(references).map(async ([column, table]) => {
            const ids = [
                ...new Set(
                    items
                        .map((item) => item[column])
                        .filter((id): id is string => typeof id === 'string')
                )
            ]

            const chunks = Array.from(
                { length: Math.ceil(ids.length / MAX_BOUND_PARAMETERS) },
                (_, index) =>
                    ids.slice(
                        index * MAX_BOUND_PARAMETERS,
                        (index + 1) * MAX_BOUND_PARAMETERS
                    )
            )

            const rows = (
                await Promise.all(
                    chunks.map(async (chunk) => {
                        const { results } = await Database().prepare(
                            `SELECT * FROM ${table.name} WHERE _id IN (${chunk.map(() => '?').join(', ')})`
                        )
                            .bind(...chunk)
                            .all<Record<string, unknown>>()

                        return results.map(
                            (row) =>
                                MapRow<Record<string, unknown>>(table, row) as Record<
                                    string,
                                    unknown
                                >
                        )
                    })
                )
            ).flat()

            const byId = new Map(rows.map((row) => [row._id, row]))

            for (const item of items)
                if (item[column] !== null && item[column] !== undefined)
                    item[column] = byId.get(item[column]) ?? null
        })
    )
}

export default Populate