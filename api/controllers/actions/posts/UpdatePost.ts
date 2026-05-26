import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { ObjectId } from '@/controllers/libs/mongo'
import { CountryModel, PostModel, CityModel } from '@/data/models'
import { Console } from '@/controllers/helpers/logs'
import { PostListSelector } from '@/data/constants/Selectors'
import { GetCities, GetCountries } from '@/controllers/helpers/entities'
import { POPULATE, POST_STATUSES } from '@/data/constants'

import {
    BloodGroupValidation,
    CityValidation,
    CountryValidation,
    PostDescriptionValidation,
    PostTitleValidation,
    PostTypeValidation
} from '@/controllers/helpers/validations'

const UpdatePost = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const didCompleteProfile = user.ProfileCompleted

            if (didCompleteProfile) {
                const {
                    PostId,
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

                const citiesIds = cities.map((city) => city._id.toString())
                const countriesIds = countries.map((country) =>
                    country._id.toString()
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
                    const post = await PostModel.findOne({
                        _id: PostId,
                        Deleted: { $ne: true }
                    })

                    if (post) {
                        const allowed = post?.Status === POST_STATUSES.APPROVED

                        if (allowed) {
                            const city = await CityModel.findById(City)
                            const country = await CountryModel.findById(Country)

                            if (
                                country &&
                                country?._id !== post.Country.toString()
                            ) {
                                country.Posts += 1
                                await country.save()

                                const oldCountry = await CountryModel.findById(
                                    post.Country
                                )
                                const countryId = ObjectId(Country)

                                if (oldCountry) {
                                    oldCountry.Posts -= 1
                                    await oldCountry.save()
                                }

                                // @ts-expect-error - It thinks that it needs the full object
                                if (countryId) post.Country = countryId
                            }

                            if (city && city?._id !== post.City.toString()) {
                                city.Posts += 1
                                await city.save()

                                const oldCity = await CityModel.findById(
                                    post.City
                                )
                                const cityId = ObjectId(City)

                                if (oldCity) {
                                    oldCity.Posts -= 1
                                    await oldCity.save()
                                }

                                // @ts-expect-error - It thinks that it needs the full object
                                if (cityId) post.City = cityId
                            }

                            post.Title = Title
                            post.Description = Description
                            post.Type = Type
                            post.BloodGroup = BloodGroup
                            post.Urgent = Urgent
                            post.Updated_At = CurrentTimestamp()

                            await post.save()
                            await user.save()

                            const newPost = await PostModel.findOne({
                                _id: post?._id
                            })
                                .populate(POPULATE.USER)
                                .populate(POPULATE.COUNTRY)
                                .populate(POPULATE.CITY)
                                .select(PostListSelector)
                                .lean()

                            if (newPost)
                                return await HttpResponder({
                                    c,
                                    success: true,
                                    message: 'Postimi u përditësua me sukses.',
                                    data: newPost,
                                    code: 201
                                })
                            else
                                return await HttpResponder({
                                    c,
                                    success: false,
                                    message: 'Postimi nuk mund të përditësohet.',
                                    data: null,
                                    code: 500
                                })
                        }
                    } else
                        return await HttpResponder({
                            c,
                            success: false,
                            message: 'Postimi nuk u gjet kështu që nuk mund të përditësohet.',
                            code: 404,
                            data: null
                        })
                } else
                    return await HttpResponder({
                        c,
                        success: false,
                        message: 'Gabimi i validimit të formës kështu që postimi nuk mund të përditësohet.',
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
                    message: 'Profili nuk është i plotësuar kështu që nuk mund të përditësohet postimi.',
                    data: null,
                    code: 400
                })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'Përdoruesi nuk ekziston kështu që nuk mund të përditësohet postimi.',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('UpdatePost', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Postimi nuk mund të përditësohet.',
            data: null,
            code: 500
        })
    }
}

export default UpdatePost