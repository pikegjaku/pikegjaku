import type { Context } from 'hono'
import type { CenterInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CentersTable, CitiesTable, CountriesTable } from '@/data/tables'
import { ListFilter } from '@/controllers/filters'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListCenters = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters = ListFilter(term, ['Name'])

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

        if (centers) {
            if (centers?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qendrave u mor me sukses.',
                    code: 200,
                    data: { centers, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qendrave u mor por është bosh.',
                    code: 200,
                    data: { centers: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e qendrave nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListCenters', error)

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