import type { ColumnKind } from '@/ts'

const FromColumn = (kind: ColumnKind | undefined, value: unknown): unknown => {
    if (value === null || value === undefined)
        return kind === 'json' ? undefined : null
    if (kind === 'boolean') return value === 1
    if (kind === 'date') return new Date(value as string)
    if (kind === 'json') return JSON.parse(value as string)

    return value
}

export default FromColumn