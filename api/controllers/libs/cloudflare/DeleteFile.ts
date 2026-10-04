import { env } from 'cloudflare:workers'
import { Console } from '@/controllers/helpers/logs'

const DeleteFile = async (path: string): Promise<boolean> => {
    try {
        await env.CDN.delete(path)

        return true
    } catch (error) {
        Console.Error('DeleteFile', error)
        return false
    }
}

export default DeleteFile