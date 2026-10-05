import type { QueryFilter } from 'mongoose'
import type {
    PostInterface,
    PostListFilterFunctionPropTypes,
    PostsListFilterOptionTypes
} from '@/ts'

import { POST_STATUSES, POST_TYPES } from '@/data/constants'

const PostsListFilter = (
    props: PostListFilterFunctionPropTypes
): QueryFilter<PostInterface> => {
    const { user, term, city, same_blood_group } = props

    const filters: PostsListFilterOptionTypes = {
        Status: POST_STATUSES.APPROVED,
        Deleted: { $ne: true }
    }

    if (term)
        filters['Title'] = {
            $regex: term,
            $options: 'i'
        }

    filters['Type'] = POST_TYPES.BLOOD

    if (city) filters['City'] = user?.City._id
    if (same_blood_group) filters['BloodGroup'] = user.BloodGroup

    return filters as QueryFilter<PostInterface>
}

export default PostsListFilter