import type { Context } from 'hono'

import { UserModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { MAX_ENTITY_ITEMS, POPULATE } from '@/data/constants'

const ListUsers = async (c: Context) => {
    try {
        const { skip, limit, term } = await c.req.json()

        const filters: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (term) {
            filters.$or = [
                { Name: { $regex: term, $options: 'i' } },
                { Surname: { $regex: term, $options: 'i' } },
                { Phone: { $regex: term, $options: 'i' } }
            ]
        }

        const [count, users] = await Promise.all([
            UserModel.countDocuments(filters),
            UserModel.find(filters)
                .populate(POPULATE.COUNTRY)
                .populate(POPULATE.CITY)
                .sort({ Created_At: -1, _id: 1 })
                .skip(skip || 0)
                .limit(
                    limit > MAX_ENTITY_ITEMS ? MAX_ENTITY_ITEMS : limit || 20
                )
                .lean()
        ])

        if (users) {
            if (users?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e përdoruesve u mor me sukses.',
                    code: 200,
                    data: { users, count }
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e përdoruesve u mor por është bosh.',
                    code: 200,
                    data: { users: [], count: 0 }
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e përdoruesve nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('AdminListUsers', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e përdoruesve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListUsers