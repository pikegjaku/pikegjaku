import type { Context } from 'hono'

import { CountryModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS } from '@/data/constants'

const ListCountries = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (term) {
            filters.Name = { $regex: term, $options: 'i' }
        }

        const [count, countries] = await Promise.all([
            CountryModel.countDocuments(filters),
            CountryModel.find(filters)
                .sort({ Name: 1, _id: 1 })
                .skip(skip || 0)
                .limit(
                    limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20
                )
                .lean()
        ])

        if (countries) {
            if (countries?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e shteteve u mor me sukses.',
                    code: 200,
                    data: { countries, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e shteteve u mor por është bosh.',
                    code: 200,
                    data: { countries: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e shteteve nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListCountries', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e shteteve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListCountries