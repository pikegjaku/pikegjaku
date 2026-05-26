import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CalculateTime, CurrentTimestamp } from '@/data/dates'
import { Console } from '@/controllers/helpers/logs'

import {
    CityModel,
    CountryModel,
    PostModel,
    VerificationModel
} from '@/data/models'

const CloseAccount = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { days } = CalculateTime(CurrentTimestamp(), user?.Created_At)

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
                const posts = await PostModel.find({
                    User: user._id,
                    Deleted: { $ne: true }
                })

                for (const post of posts) {
                    await CountryModel.updateOne(
                        { _id: post.Country },
                        {
                            $inc: {
                                Posts: -1
                            },
                            $set: {
                                Updated_At: CurrentTimestamp()
                            }
                        }
                    )

                    await CityModel.updateOne(
                        { _id: post.City },
                        {
                            $inc: {
                                Posts: -1
                            },
                            $set: {
                                Updated_At: CurrentTimestamp()
                            }
                        }
                    )

                    post.Deleted = true
                    post.Deleted_At = CurrentTimestamp()
                    await post.save()
                }

                await CountryModel.updateOne(
                    { _id: user.Country },
                    {
                        $inc: {
                            Users: -1
                        },
                        $set: {
                            Updated_At: CurrentTimestamp()
                        }
                    }
                )

                await CityModel.updateOne(
                    { _id: user.City },
                    {
                        $inc: {
                            Users: -1
                        },
                        $set: {
                            Updated_At: CurrentTimestamp()
                        }
                    }
                )

                await VerificationModel.deleteMany({ User: user._id })

                user.Deleted = true
                user.Deleted_At = CurrentTimestamp()
                await user.save()

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