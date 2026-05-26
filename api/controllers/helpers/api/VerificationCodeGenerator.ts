import crypto from 'node:crypto'

import { VerificationModel } from '@/data/models'
import { Console } from '@/controllers/helpers/logs'

const VerificationCodeGenerator = async (): Promise<number | null> => {
    let code = null

    try {
        while (code === null) {
            const random_code = crypto.randomInt(11432, 97503)
            const exists = await VerificationModel.exists({ Code: random_code })

            if (!exists) {
                code = random_code
                break
            }
        }

        return code
    } catch (error) {
        Console.Error('VerificationCodeGenerator', error)
        return null
    }
}

export default VerificationCodeGenerator