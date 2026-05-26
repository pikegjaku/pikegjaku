import type { HttpResponderFunctionProps, RequestResponseTypes } from '@/ts'

const HttpResponder = async (inital: HttpResponderFunctionProps) => {
    const { c, success, message, data, code } = inital

    c.status(code)

    const res_data: RequestResponseTypes = {
        success,
        message,
        data,
        code
    }

    return c.json(res_data)
}

export default HttpResponder