import { env } from 'cloudflare:workers'
import Bind from '@/controllers/libs/d1/Bind'

const Query = async <T>(
    statement: string,
    params: Array<unknown> = []
): Promise<Array<T>> => {
    const { results } = await env.DB.prepare(statement)
        .bind(...params.map(Bind))
        .all<T>()

    return results
}

export default Query