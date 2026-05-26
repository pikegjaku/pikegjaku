import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { CurrentTimestamp } from '@/data/dates'

import { CityModel, CountryModel, PostModel } from '@/data/models'

const DeletePost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { postId } = await c.req.json()

            const post = await PostModel.findOne({
                _id: postId,
                Deleted: { $ne: true }
            })

            if (post) {
                const isAllowed =
                    post?.User?.toString() === user?._id?.toString()

                if (isAllowed) {
                    user.Posts = user.Posts - 1

                    await user.save()

                    post.Deleted = true
                    post.Deleted_At = CurrentTimestamp()
                    await post.save()

                    await CountryModel.findByIdAndUpdate(post.Country, {
                        $inc: {
                            Posts: -1
                        }
                    })

                    await CityModel.findByIdAndUpdate(post.City, {
                        $inc: {
                            Posts: -1
                        }
                    })

                    return await HttpResponder({
                        c,
                        success: true,
                        message: 'Postimi u fshi me sukses.',
                        data: null,
                        code: 200
                    })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Përdoruesi nuk është i autorizuar të fshijë këtë postim.',
                        data: null,
                        code: 401
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Postimi nuk u gjet.',
                    data: null,
                    code: 404
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk u gjet ose nuk është i autentikuar.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('DeletePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të fshihet.',
            data: null,
            code: 500
        })
    }
}

export default DeletePost