import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'

const CatchAll = async (c: Context) =>
    await HttpResponder({
        c,
        success: false,
        message: 'Kjo rrugë për në faqen që kërkoni nuk u gjet. Nëse mendoni se ky është një gabim atëhere kontaktoni ekipin zhvillues.',
        data: null,
        code: 404
    })

export default CatchAll