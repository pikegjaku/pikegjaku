import type { EnvlessDiff } from '@/envless/ts/Interfaces'

const ReportDiff = (diff: EnvlessDiff, target: string): void => {
    console.info(`EnvlessInject: comparing the feed against ${target}`)
    console.info(`  ${diff.same.length} identical`)

    if (diff.changed.length > 0)
        console.info(
            `  ${diff.changed.length} differ, the feed wins: ${diff.changed.join(', ')}`
        )

    if (diff.added.length > 0)
        console.info(
            `  ${diff.added.length} only in the feed: ${diff.added.join(', ')}`
        )

    if (diff.missing.length > 0)
        console.warn(
            `  ${diff.missing.length} still only local, migrate these: ${diff.missing.join(', ')}`
        )

    if (diff.changed.length === 0 && diff.missing.length === 0)
        console.info('  the feed covers every local variable')
}

export default ReportDiff