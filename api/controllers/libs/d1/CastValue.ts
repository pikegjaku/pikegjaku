import type { ColumnKind } from '@/ts'

import { BOOLEAN_FALSE_VALUES, BOOLEAN_TRUE_VALUES } from '@/data/constants'

const PRIMITIVES = ['string', 'number', 'boolean']

const CastValue = (kind: ColumnKind, value: unknown): unknown => {
    if (value === null || value === undefined) return null

    if (kind === 'json') return value

    if (kind === 'boolean') {
        if (BOOLEAN_TRUE_VALUES.includes(value)) return true
        if (BOOLEAN_FALSE_VALUES.includes(value)) return false
    }

    if (kind === 'number') {
        if (value === '') return null

        const number = PRIMITIVES.includes(typeof value) ? Number(value) : NaN

        if (!Number.isNaN(number)) return number
    }

    if (kind === 'date') {
        if (value === '') return null

        const date =
            value instanceof Date
                ? value
                : new Date(PRIMITIVES.includes(typeof value) ? (value as string) : NaN)

        if (!Number.isNaN(date.getTime())) return date
    }

    if (kind === 'text' && PRIMITIVES.includes(typeof value)) return String(value)

    throw new TypeError(`Vlera nuk përputhet me kolonën e tipit ${kind}.`)
}

export default CastValue