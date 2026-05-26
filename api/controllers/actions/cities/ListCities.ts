import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { GetCities } from '@/controllers/helpers/entities'

const List = async (c: Context) => {
    try {
        const cities = await GetCities()

        if (Array.isArray(cities)) {
            if (cities?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qyteteve u mor me sukses.',
                    data: cities,
                    code: 200
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e qyteteve u mor por është bosh.',
                    data: [],
                    code: 200
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
        Console.Error('ListCities', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e qyteteve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default List