import type { Context } from 'hono'

import { PostModel } from '@/data/models'
import { HttpResponder } from '@/controllers/helpers/http'
import { Console } from '@/controllers/helpers/logs'
import { POPULATE } from '@/data/constants'

const ListPost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { postId } = await c.req.json()

            const filter = {
                _id: postId,
                Deleted: { $ne: true }
            }

            const post = await PostModel.findOne(filter)
                .populate(POPULATE.USER)
                .populate(POPULATE.COUNTRY)
                .populate(POPULATE.CITY)

            if (post) {
                post.Views = post.Views + 1
                await post.save()

                return await HttpResponder({
                    c,
                    success: true,
                    message: 'Postimi u gjet me sukses.',
                    data: post,
                    code: 200
                })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Postimi nuk mund të gjendet.',
                    data: null,
                    code: 404
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk është i autorizuar të shohë këtë postim.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('ViewPost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të gjendet për shkak të një gabimi.',
            data: null,
            code: 500
        })
    }
}

export default ListPost