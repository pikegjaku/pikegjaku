import type { Context } from 'hono'
import type { TableDefinition, TimelineRow } from '@/ts'

import { Count, Query } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'

const getPeriodDate = (period: string): Date | null => {
    const now = new Date()

    switch (period) {
        case 'today':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        case 'week':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case 'month':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case 'year':
            return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        default:
            return null
    }
}

const getTimeline = async (
    table: TableDefinition,
    dateField: string,
    fromDate: Date | null
) => {
    const conditions = ['Deleted IS NOT 1']

    if (fromDate) conditions.push(`${dateField} >= ?`)

    const rows = await Query<TimelineRow>(
        `SELECT substr(${dateField}, 1, 10) AS day, COUNT(*) AS count FROM ${table.name} WHERE ${conditions.join(' AND ')} GROUP BY day ORDER BY day ASC`,
        fromDate ? [fromDate] : []
    )

    return rows.map(({ day, count }) => ({ _id: day, count }))
}

const Stats = async (c: Context) => {
    try {
        const { period } = await c.req.json()
        const fromDate = getPeriodDate(period || 'all')

        const dateFilter = {
            where: fromDate
                ? 'Deleted IS NOT 1 AND Created_At >= ?'
                : 'Deleted IS NOT 1',
            params: fromDate ? [fromDate] : []
        }

        const activeFilter = { where: 'Deleted IS NOT 1', params: [] }

        const [users, posts, cities, countries, usersTimeline, postsTimeline] =
            await Promise.all([
                Count(UsersTable, dateFilter),
                Count(PostsTable, dateFilter),
                Count(CitiesTable, activeFilter),
                Count(CountriesTable, activeFilter),
                getTimeline(UsersTable, 'Created_At', fromDate),
                getTimeline(PostsTable, 'Created_At', fromDate)
            ])

        return await HttpResponder({
            c,
            success: true,
            message: 'Statistikat u morën me sukses.',
            code: 200,
            data: {
                users,
                posts,
                cities,
                countries,
                timeline: {
                    users: usersTimeline,
                    posts: postsTimeline
                }
            }
        })
    } catch (error) {
        Console.Error('AdminStats', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Statistikat nuk mund tu merrte.',
            data: null,
            code: 500
        })
    }
}

export default Stats