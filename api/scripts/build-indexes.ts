import mongoose from 'mongoose'
import { env } from '@goenvless/env/server'
import {
    CenterModel,
    CityModel,
    CountryModel,
    PostModel,
    UserModel,
    VerificationModel,
    WaitlistModel
} from '@/data/models'
import { Console } from '@/controllers/helpers/logs'
import { MONGO_OPTIONS } from '@/data/constants'

const Run = async () => {
    await mongoose.connect(env.DATABASE_URL, MONGO_OPTIONS)

    const models = [
        CenterModel,
        CityModel,
        CountryModel,
        PostModel,
        UserModel,
        VerificationModel,
        WaitlistModel
    ]

    let failed = 0

    for (const model of models) {
        try {
            await model.createIndexes()

            Console.Info('BuildIndexes', model.modelName)
        } catch (error) {
            failed += 1

            Console.Error(`BuildIndexes:${model.modelName}`, error)
        }
    }

    await mongoose.disconnect()

    if (failed > 0) process.exit(1)
}

try {
    await Run()
} catch (error) {
    Console.Error('BuildIndexes', error)
    process.exit(1)
}