import moment from 'moment'

import { TimestampFormat } from '@/data/constants'

const CurrentTimestamp = (f?: string): Date => {
    const format = f ? f : TimestampFormat

    const now = moment()
    now.format(format)

    return now.toDate()
}

export default CurrentTimestamp