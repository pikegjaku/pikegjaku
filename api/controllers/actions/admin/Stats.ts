import type { Context } from 'hono'

import { UserModel, PostModel, CityModel, CountryModel } from '@/data/models'
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
    model: typeof UserModel | typeof PostModel,
    dateField: string,
    fromDate: Date | null
) => {
    const match: Record<string, unknown> = { Deleted: { $ne: true } }

    if (fromDate) match[dateField] = { $gte: fromDate }

    return await model.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: `$${dateField}` }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
}

const Stats = async (c: Context) => {
    try {
        const { period } = await c.req.json()
        const fromDate = getPeriodDate(period || 'all')

        const dateFilter: Record<string, unknown> = {
            Deleted: { $ne: true }
        }

        if (fromDate) dateFilter.Created_At = { $gte: fromDate }

        const [users, posts, cities, countries, usersTimeline, postsTimeline] =
            await Promise.all([
                UserModel.countDocuments(dateFilter),
                PostModel.countDocuments(dateFilter),
                CityModel.countDocuments({ Deleted: { $ne: true } }),
                CountryModel.countDocuments({ Deleted: { $ne: true } }),
                getTimeline(UserModel, 'Created_At', fromDate),
                getTimeline(PostModel, 'Created_At', fromDate)
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