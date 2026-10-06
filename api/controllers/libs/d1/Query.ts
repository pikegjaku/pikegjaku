import Database from '@/controllers/libs/d1/Database'
import Bind from '@/controllers/libs/d1/Bind'

const Query = async <T>(
    statement: string,
    params: Array<unknown> = []
): Promise<Array<T>> => {
    const { results } = await Database().prepare(statement)
        .bind(...params.map(Bind))
        .all<T>()

    return results
}

export default Query