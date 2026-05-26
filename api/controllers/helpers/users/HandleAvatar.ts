import type { HandleAvatarInput, HandleAvatarResult } from '@/ts'

import sharp from 'sharp'

import { DeleteFile, UploadToBucket } from '@/controllers/libs/cloudflare'

import {
    CLOUDFLARE_BUCKETS,
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

        const deleted = await DeleteFile(path, CLOUDFLARE_BUCKETS.CDN)

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

    let buffer: Buffer

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

    if (currentAvatar) await DeleteFile(path, CLOUDFLARE_BUCKETS.CDN)

    let processed: Buffer

    try {
        processed = await sharp(buffer)
            .resize(250, 250)
            .webp({ quality: 50 })
            .toBuffer()
    } catch {
        return {
            ok: false,
            code: 400,
            message: 'Fotografia është e pasaktë!'
        }
    }

    const uploaded = await UploadToBucket({
        bucket: CLOUDFLARE_BUCKETS.CDN,
        path,
        file: processed,
        type: FILE_TYPES.IMAGE.WEBP,
        publicObject: true
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