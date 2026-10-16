import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CentersTable, CitiesTable, CountriesTable } from '@/data/tables'
import { CentersListFilter } from '@/controllers/filters'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListCenters = async (c: Context) => {
    try {
        const { skip, limit, term, country, city } = await c.req.json()

        const filters = CentersListFilter({
            term: term || null,
            country: country || null,
            city: city || null
        })

        const [count, centers] = await Promise.all([
            Count(CentersTable, filters),
            Find<CenterInterface>(CentersTable, {
                ...filters,
                order: 'Name ASC, _id ASC',
                skip: skip || 0,
                limit: limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20,
                references: {
                    City: CitiesTable,
                    Country: CountriesTable
                }
            })
        ])

        if (centers)
            return await HttpResponder({
                c,
                success: true,
                message: centers.length > 0 ? 'Lista e qendrave u mor me sukses.' : 'Lista e qendrave u mor por është bosh.',
                code: 200,
                data: { centers, count: centers.length > 0 ? count : 0 }
            })
        else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e qendrave nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('ListCenters', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e qendrave nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListCenters