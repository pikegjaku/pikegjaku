import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { CountryModel, PostModel, CityModel } from '@/data/models'
import { Console } from '@/controllers/helpers/logs'
import { ObjectId } from '@/controllers/libs/mongo'
import { PostListSelector } from '@/data/constants/Selectors'
import { GetCities, GetCountries } from '@/controllers/helpers/entities'
import { POPULATE, POST_TYPES } from '@/data/constants'

import {
    BloodGroupValidation,
    CityValidation,
    CountryValidation,
    PostDescriptionValidation,
    PostTitleValidation,
    PostTypeValidation
} from '@/controllers/helpers/validations'

const CreatePost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const didCompleteProfile = user.ProfileCompleted

            if (didCompleteProfile) {
                const { _id: User } = user

                const {
                    Title,
                    Description,
                    BloodGroup,
                    City,
                    Type,
                    Country,
                    Urgent
                } = await c.req.json()

                const [cities, countries] = await Promise.all([
                    GetCities(),
                    GetCountries()
                ])

                const citiesIds = cities.map((city) => city?._id.toString())
                const countriesIds = countries.map((country) =>
                    country?._id.toString()
                )

                const titleValidation = PostTitleValidation(Title)
                const descriptionValidation =
                    PostDescriptionValidation(Description)
                const bloodGroupValidation = BloodGroupValidation(BloodGroup)
                const typeValidation = PostTypeValidation(Type)
                const cityValidation = CityValidation(City, citiesIds)
                const countryValidation = CountryValidation(
                    Country,
                    countriesIds
                )

                const isError =
                    titleValidation.error ||
                    descriptionValidation.error ||
                    bloodGroupValidation.error ||
                    typeValidation.error ||
                    cityValidation.error ||
                    countryValidation.error

                if (!isError) {
                    const post = new PostModel({
                        Title,
                        Description,
                        City: ObjectId(City),
                        Type,
                        Country,
                        User,
                        Urgent,
                        BloodGroup:
                            Type === POST_TYPES.BLOOD ? BloodGroup : null,
                        Created_At: CurrentTimestamp(),
                        Updated_At: CurrentTimestamp()
                    })

                    await post.save()

                    await Promise.all([
                        CityModel.findByIdAndUpdate(City, {
                            $inc: { Posts: 1 }
                        }),
                        CountryModel.findByIdAndUpdate(Country, {
                            $inc: { Posts: 1 }
                        })
                    ])

                    user.Posts += 1

                    await user.save()

                    const newPost = await PostModel.findOne({ _id: post?._id })
                        .populate(POPULATE.USER)
                        .populate(POPULATE.COUNTRY)
                        .populate(POPULATE.CITY)
                        .select(PostListSelector)
                        .lean()

                    if (newPost)
                        return await HttpResponder({
                            c,
                            success: true,
                            message: 'Postimi u krijua me sukses.',
                            data: newPost,
                            code: 201
                        })
                    else
                        return await HttpResponder({
                            c,
                            success: false,
                            message: 'Postimi nuk mund të krijohet.',
                            data: null,
                            code: 500
                        })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Vendi nuk u gjet kështu që nuk mund të krijohet postimi.',
                        code: 400,
                        data: {
                            Title: titleValidation,
                            Description: descriptionValidation,
                            BloodGroup: bloodGroupValidation,
                            Type: typeValidation,
                            City: cityValidation,
                            Country: countryValidation
                        }
                    })
            } else
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Profili nuk është i plotësuar kështu që nuk mund të krijohet postimi.',
                    data: null,
                    code: 400
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk ekziston kështu që nuk mund të krijohet postimi.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('CreatePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të krijohet.',
            data: null,
            code: 500
        })
    }
}

export default CreatePost