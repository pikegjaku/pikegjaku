import type { PostListFilterFunctionPropTypes, SqlFilter } from '@/ts'

import ListFilter from '@/controllers/filters/ListFilter'
import { POST_STATUSES, POST_TYPES } from '@/data/constants'

const PostsListFilter = (props: PostListFilterFunctionPropTypes): SqlFilter => {
    const { user, term, city, same_blood_group } = props

    const { where, params } = ListFilter(term, ['Title'])

    const conditions = ['Status = ?', where, 'Type = ?']
    const values: Array<unknown> = [POST_STATUSES.APPROVED, ...params, POST_TYPES.BLOOD]

    if (city) {
        conditions.push('City IS ?')
        values.push(user?.City)
    }

    if (same_blood_group) {
        conditions.push('BloodGroup IS ?')
        values.push(user.BloodGroup)
    }

    return { where: conditions.join(' AND '), params: values }
}

export default PostsListFilter