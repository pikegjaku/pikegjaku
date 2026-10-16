import type { CentersListFilterFunctionPropTypes, SqlFilter } from '@/ts'

import ListFilter from '@/controllers/filters/ListFilter'

const CentersListFilter = (props: CentersListFilterFunctionPropTypes): SqlFilter => {
    const { term, country, city } = props

    const { where, params } = ListFilter(term, ['Name', 'Address'])

    const conditions = [where, 'Active = 1']
    const values: Array<unknown> = [...params]

    if (country) {
        conditions.push('Country = ?')
        values.push(country)
    }

    if (city) {
        conditions.push('City = ?')
        values.push(city)
    }

    return { where: conditions.join(' AND '), params: values }
}

export default CentersListFilter