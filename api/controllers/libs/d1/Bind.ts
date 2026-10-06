import type { SqlValue } from '@/ts'

const Bind = (value: unknown): SqlValue => {
    if (value === null || value === undefined) return null
    if (value instanceof Date) return value.toISOString()
    if (typeof value === 'boolean') return value ? 1 : 0
    if (typeof value === 'string' || typeof value === 'number') return value

    throw new TypeError('Vlera e kërkimit nuk është e vlefshme.')
}

export default Bind