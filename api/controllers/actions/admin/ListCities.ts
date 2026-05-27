import type { Context } from 'hono'

import { CityModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListCities = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (term) {
            filters.Name = { $regex: term, $options: 'i' }
        }

        const [count, cities] = await Promise.all([
            CityModel.countDocuments(filters),
            CityModel.find(filters)
                .populate(POPULATE.COUNTRY)
                .sort({ Name: 1, _id: 1 })
                .skip(skip || 0)
                .limit(
                    limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20
                )
                .lean()
        ])

        if (cities) {
            if (cities?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qendrave u mor me sukses.',
                    code: 200,
                    data: { cities, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qendrave u mor por është bosh.',
                    code: 200,
                    data: { cities: [], count: 0 }
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
        Console.Error('AdminListCities', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e qendrave nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListCities