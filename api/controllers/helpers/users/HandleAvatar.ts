import type { HandleAvatarInput, HandleAvatarResult } from '@/ts'

import { env } from 'cloudflare:workers'
import { DeleteFile, UploadToBucket } from '@/controllers/libs/cloudflare'
import { Console } from '@/controllers/helpers/logs'

import {
    CLOUDFLARE_CDN_PATHS,
    DATA_URI_PATTERN,
    FILE_EXTENSIONS,
    FILE_TYPES,
    MAX_AVATAR_BYTES
} from '@/data/constants'

const HandleAvatar = async ({
    userId,
    currentAvatar,
    incomingAvatar
}: HandleAvatarInput): Promise<HandleAvatarResult> => {
    const path = `${CLOUDFLARE_CDN_PATHS.AVATARS}/${userId}.${FILE_EXTENSIONS.WEBP}`

    const incomingPath =
        typeof incomingAvatar === 'string'
            ? incomingAvatar.split('?')[0]
            : incomingAvatar

    if (incomingAvatar === undefined || incomingPath === currentAvatar)
        return { ok: true, changed: false, path: currentAvatar }

    if (incomingAvatar === null) {
        if (!currentAvatar) return { ok: true, changed: false, path: null }

        const deleted = await DeleteFile(path)

        if (!deleted)
            return {
                ok: false,
                code: 500,
                message: 'Fotografia e profilit nuk u fshi për shkak të një gabimi.'
            }

        return { ok: true, changed: true, path: null }
    }

    const match = incomingAvatar.match(DATA_URI_PATTERN)
    const base64 = match ? match[1] : incomingAvatar

    let buffer: Buffer<ArrayBuffer>

    try {
        buffer = Buffer.from(base64, 'base64')
    } catch {
        return {
            ok: false,
            code: 400,
            message: 'Fotografia është e pasaktë!'
        }
    }

    if (!buffer.length)
        return {
            ok: false,
            code: 400,
            message: 'Fotografia është e pasaktë!'
        }

    if (buffer.length > MAX_AVATAR_BYTES) {
        const maxSizeMb = `${(MAX_AVATAR_BYTES / 1024 / 1024).toFixed(2)} MB`

        return {
            ok: false,
            code: 400,
            message: `Fotografia është më e madhe se ${maxSizeMb}!`
        }
    }

    let processed: ArrayBuffer

    try {
        const output = await env.IMAGES.input(new Blob([buffer]).stream())
            .transform({ width: 250, height: 250, fit: 'cover' })
            .output({ format: FILE_TYPES.IMAGE.WEBP, quality: 50 })

        processed = await output.response().arrayBuffer()
    } catch (error) {
        Console.Error('HandleAvatar', error)

        return {
            ok: false,
            code: 400,
            message: 'Fotografia është e pasaktë!'
        }
    }

    const uploaded = await UploadToBucket({
        path,
        file: processed,
        type: FILE_TYPES.IMAGE.WEBP
    })

    if (!uploaded)
        return {
            ok: false,
            code: 500,
            message: 'Fotografia e profilit nuk u ngarkua për shkak të një gabimi.'
        }

    return { ok: true, changed: true, path }
}

export default HandleAvatar