import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { GetCountries } from '@/controllers/helpers/entities'

const ListCountries = async (c: Context) => {
    try {
        const countries = await GetCountries()

        if (Array.isArray(countries)) {
            if (countries?.length > 0)
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e vendeve u mor me sukses.',
                    data: countries,
                    code: 200
                })
            else
                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Lista e vendeve u mor por është bosh',
                    data: [],
                    code: 200
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Lista e vendeve nuk mund tu merrte.',
                data: null,
                code: 500
            })
    } catch (error) {
        Console.Error('ListCountries', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Lista e vendeve nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default ListCountries