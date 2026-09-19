import mongoose from 'mongoose'
import { env } from '@goenvless/env/server'
import { CityModel, CountryModel } from '@/data/models'
import { Console } from '@/controllers/helpers/logs'
import { Slugify } from '@/controllers/helpers/generals'
import { CurrentTimestamp } from '@/data/dates'
import { Locations } from '@/data/seed'
import { MONGO_OPTIONS } from '@/data/constants'

const Run = async () => {
    await mongoose.connect(env.DATABASE_URL, MONGO_OPTIONS)

    let countriesCreated = 0
    let citiesCreated = 0

    for (const location of Locations) {
        const now = CurrentTimestamp()

        await CountryModel.updateOne(
            { Name: location.Name },
            {
                $setOnInsert: {
                    Name: location.Name,
                    Code: location.Code,
                    Created_At: now
                },
                $set: { Updated_At: now }
            },
            { upsert: true }
        )

        const country = await CountryModel.findOne({ Name: location.Name })

        if (!country) continue

        for (const name of location.Cities) {
            const result = await CityModel.updateOne(
                { Name: name },
                {
                    $setOnInsert: {
                        Name: name,
                        Value: Slugify(name),
                        Country: country._id,
                        Created_At: now
                    },
                    $set: { Updated_At: now }
                },
                { upsert: true }
            )

            if (result.upsertedCount > 0) citiesCreated += 1
        }

        const total = await CityModel.countDocuments({
            Country: country._id,
            Deleted: { $ne: true }
        })

        await CountryModel.updateOne(
            { _id: country._id },
            { $set: { Cities: total, Updated_At: now } }
        )

        countriesCreated += 1

        Console.Info('SeedCountriesCities', `${location.Name}: ${total} qytete`)
    }

    Console.Info(
        'SeedCountriesCities',
        `${countriesCreated} shtete, ${citiesCreated} qytete të reja`
    )

    await mongoose.disconnect()
}

try {
    await Run()
} catch (error) {
    Console.Error('SeedCountriesCities', error)
    process.exit(1)
}