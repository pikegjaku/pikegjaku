import { Types } from 'mongoose'
import { Console } from '@/controllers/helpers/logs'

const ObjectId = (id: string): Types.ObjectId | null => {
    try {
        return new Types.ObjectId(id)
    } catch (error) {
        Console.Error('ObjectId', error)
        return null
    }
}

export default ObjectId