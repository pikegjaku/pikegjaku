import type { SqlFilter } from '@/ts'

import { EscapeLike } from '@/controllers/helpers/generals'

const ListFilter = (term: unknown, columns: Array<string>): SqlFilter => {
    const conditions = ['Deleted IS NOT 1']
    const params: Array<unknown> = []

    if (term) {
        conditions.push(
            `(${columns.map((column) => `${column} LIKE ? ESCAPE '\\'`).join(' OR ')})`
        )
        params.push(...columns.map(() => `%${EscapeLike(term)}%`))
    }

    return { where: conditions.join(' AND '), params }
}

export default ListFilter