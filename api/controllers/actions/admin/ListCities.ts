import type { Context } from 'hono'
import type { CityInterface } from '@/ts'

import { Count, Find } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable } from '@/data/tables'
import { ListFilter } from '@/controllers/filters'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListCities = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters = ListFilter(term, ['Name'])

        const [count, cities] = await Promise.all([
            Count(CitiesTable, filters),
            Find<CityInterface>(CitiesTable, {
                ...filters,
                order: 'Name ASC, _id ASC',
                skip: skip || 0,
                limit: limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20,
                references: {
                    Country: CountriesTable
                }
            })
        ])

        if (cities) {
            if (cities?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qyteteve u mor me sukses.',
                    code: 200,
                    data: { cities, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qyteteve u mor por është bosh.',
                    code: 200,
                    data: { cities: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e qyteteve nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListCities', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e qyteteve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListCities