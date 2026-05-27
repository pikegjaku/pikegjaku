import type { Context } from 'hono'

import { CenterModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListCenters = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (term) {
            filters.Name = { $regex: term, $options: 'i' }
        }

        const [count, centers] = await Promise.all([
            CenterModel.countDocuments(filters),
            CenterModel.find(filters)
                .populate(POPULATE.CITY)
                .populate(POPULATE.COUNTRY)
                .sort({ Name: 1, _id: 1 })
                .skip(skip || 0)
                .limit(
                    limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20
                )
                .lean()
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