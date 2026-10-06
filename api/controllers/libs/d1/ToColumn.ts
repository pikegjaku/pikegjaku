import type { ColumnKind, SqlValue } from '@/ts'

import CastValue from '@/controllers/libs/d1/CastValue'

const ToColumn = (kind: ColumnKind, value: unknown): SqlValue => {
    const cast = CastValue(kind, value)

    if (cast === null) return null
    if (kind === 'boolean') return cast ? 1 : 0
    if (kind === 'date') return (cast as Date).toISOString()
    if (kind === 'json') return JSON.stringify(cast)

    return cast as string | number
}

export default ToColumn