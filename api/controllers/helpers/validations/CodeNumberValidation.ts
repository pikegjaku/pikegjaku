import type { CodeInputValueTypes, ValidationReturnType } from '@/ts'

import { z } from 'zod'

const CodeNumberValidation = (
    code: CodeInputValueTypes
): ValidationReturnType => {
    const codeKeys = Object.keys(code)

    for (let i = 0; i < codeKeys.length; i++) {
        const codeCase = z.string().min(1).max(1).safeParse(code[codeKeys[i]])

        if (!codeCase.success)
            return {
                message: 'Kodi duhet të jetë i plotësuar!',
                error: true
            }
    }

    return {
        message: '',
        error: false
    }
}

export default CodeNumberValidation