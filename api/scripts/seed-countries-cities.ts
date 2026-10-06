import { spawn } from 'node:child_process'
import { rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import NewId from '@/controllers/libs/d1/NewId'
import { Console } from '@/controllers/helpers/logs'
import { Slugify } from '@/controllers/helpers/generals'
import { CurrentTimestamp } from '@/data/dates'
import { Locations } from '@/data/seed'

const Quote = (value: string | number): string =>
    typeof value === 'number' ? String(value) : `'${value.replace(/'/g, "''")}'`

const Execute = (command: string): Promise<number> =>
    new Promise((resolve) =>
        spawn(command, { shell: true, stdio: 'inherit' }).on('close', (code) =>
            resolve(code ?? 1)
        )
    )

const Run = async () => {
    const target = process.argv.includes('--remote') ? '--remote' : '--local'
    const now = Quote(CurrentTimestamp().toISOString())
    const statements: Array<string> = []

    for (const location of Locations) {
        statements.push(
            `INSERT INTO countries (_id, Name, Code, Created_At, Updated_At) VALUES (${Quote(NewId())}, ${Quote(location.Name)}, ${Quote(location.Code)}, ${now}, ${now}) ON CONFLICT (Name) DO UPDATE SET Updated_At = excluded.Updated_At;`
        )

        for (const name of location.Cities)
            statements.push(
                `INSERT INTO cities (_id, Name, Value, Country, Created_At, Updated_At) VALUES (${Quote(NewId())}, ${Quote(name)}, ${Quote(Slugify(name))}, (SELECT _id FROM countries WHERE Name = ${Quote(location.Name)}), ${now}, ${now}) ON CONFLICT (Name) DO UPDATE SET Updated_At = excluded.Updated_At;`
            )
    }

    statements.push(
        `UPDATE countries SET Cities = (SELECT COUNT(*) FROM cities WHERE cities.Country = countries._id AND cities.Deleted IS NOT 1), Updated_At = ${now};`
    )

    const file = join(tmpdir(), `pikegjaku-seed-${NewId()}.sql`)

    await writeFile(file, statements.join('\n'))

    let code = 0

    try {
        code = await Execute(`bunx wrangler d1 migrations apply DB ${target}`)

        if (code === 0)
            code = await Execute(
                `bunx wrangler d1 execute DB ${target} --file ${file}`
            )
    } finally {
        await rm(file, { force: true })
    }

    if (code !== 0) process.exit(code)

    Console.Info(
        'SeedCountriesCities',
        `${Locations.length} shtete, ${Locations.reduce((total, location) => total + location.Cities.length, 0)} qytete`
    )
}

try {
    await Run()
} catch (error) {
    Console.Error('SeedCountriesCities', error)
    process.exit(1)
}