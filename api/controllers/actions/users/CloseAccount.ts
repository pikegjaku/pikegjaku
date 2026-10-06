import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { HttpResponder } from '@/controllers/helpers/http'
import { CalculateTime, CurrentTimestamp } from '@/data/dates'
import { Console } from '@/controllers/helpers/logs'
import { Find, Increment, Remove, Update } from '@/controllers/libs/d1'

import {
    CitiesTable,
    CountriesTable,
    PostsTable,
    UsersTable,
    VerificationsTable
} from '@/data/tables'

const CloseAccount = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { days } = CalculateTime(user?.Created_At, CurrentTimestamp())

            const isNewUser = days < 7

            if (isNewUser)
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Llogaria nuk mund të mbyllet sepse është e re. Ajo duhet të jetë e paktën 1 javë e vjetër për tu mbyllur.',
                    data: null,
                    code: 403
                })
            else {
                const posts = await Find<PostInterface>(PostsTable, {
                    where: 'User = ? AND Deleted IS NOT 1',
                    params: [user._id]
                })

                for (const post of posts) {
                    await Increment(CountriesTable, post.Country, 'Posts', -1, {
                        Updated_At: CurrentTimestamp()
                    })

                    await Increment(CitiesTable, post.City, 'Posts', -1, {
                        Updated_At: CurrentTimestamp()
                    })

                    post.Deleted = true
                    post.Deleted_At = CurrentTimestamp()
                    await Update(PostsTable, post._id, {
                        Deleted: post.Deleted,
                        Deleted_At: post.Deleted_At
                    })
                }

                await Increment(CountriesTable, user.Country, 'Users', -1, {
                    Updated_At: CurrentTimestamp()
                })

                await Increment(CitiesTable, user.City, 'Users', -1, {
                    Updated_At: CurrentTimestamp()
                })

                await Remove(VerificationsTable, {
                    where: 'User = ?',
                    params: [user._id]
                })

                user.Deleted = true
                user.Deleted_At = CurrentTimestamp()
                await Update(UsersTable, user._id, {
                    Deleted: user.Deleted,
                    Deleted_At: user.Deleted_At
                })

                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Përdoruesi u mbyll me sukses.',
                    data: null,
                    code: 200
                })
            }
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk ekziston ose ju keni mbyllur llogarinë tuaj tashmë.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('CloseUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund të mbyllet.',
            data: null,
            code: 500
        })
    }
}

export default CloseAccount