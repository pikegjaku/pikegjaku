import type { Context } from 'hono'
import type { CityInterface, CountryInterface, PostInterface } from '@/ts'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { FindOne, Increment, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { Console } from '@/controllers/helpers/logs'
import { PostListSelector } from '@/data/constants/Selectors'
import { GetCities, GetCountries } from '@/controllers/helpers/entities'
import { POST_STATUSES } from '@/data/constants'

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
                    const post = await FindOne<PostInterface>(PostsTable, {
                        where: '_id = ? AND Deleted IS NOT 1',
                        params: [PostId]
                    })

                    if (post) {
                        const isOwner =
                            post?.User?.toString() === user?._id?.toString()
                        const allowed = post?.Status === POST_STATUSES.APPROVED

                        if (!isOwner)
                            return await HttpResponder({
                                c,
                                success: false,
                                message: 'Përdoruesi nuk është i autorizuar të përditësojë këtë postim.',
                                data: null,
                                code: 401
                            })

                        if (allowed) {
                            const [city, country] = await Promise.all([
                                FindOne<CityInterface>(CitiesTable, {
                                    where: '_id = ?',
                                    params: [City]
                                }),
                                FindOne<CountryInterface>(CountriesTable, {
                                    where: '_id = ?',
                                    params: [Country]
                                })
                            ])

                            const counters: Array<Promise<void>> = []

                            if (
                                country &&
                                country?._id !== post.Country.toString()
                            ) {
                                counters.push(
                                    Increment(CountriesTable, country._id, 'Posts', 1),
                                    Increment(CountriesTable, post.Country, 'Posts', -1)
                                )

                                post.Country = Country
                            }

                            if (city && city?._id !== post.City.toString()) {
                                counters.push(
                                    Increment(CitiesTable, city._id, 'Posts', 1),
                                    Increment(CitiesTable, post.City, 'Posts', -1)
                                )

                                post.City = City
                            }

                            post.Title = Title
                            post.Description = Description
                            post.Type = Type
                            post.BloodGroup = BloodGroup
                            post.Urgent = Urgent
                            post.Updated_At = CurrentTimestamp()

                            await Promise.all([
                                ...counters,
                                Update(PostsTable, post._id, {
                                    Country: post.Country,
                                    City: post.City,
                                    Title: post.Title,
                                    Description: post.Description,
                                    Type: post.Type,
                                    BloodGroup: post.BloodGroup,
                                    Urgent: post.Urgent,
                                    Updated_At: post.Updated_At
                                })
                            ])

                            const newPost = await FindOne<PostInterface>(
                                PostsTable,
                                {
                                    columns: PostListSelector,
                                    where: '_id = ?',
                                    params: [post?._id],
                                    references: {
                                        User: UsersTable,
                                        Country: CountriesTable,
                                        City: CitiesTable
                                    }
                                }
                            )

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
                        } else
                            return await HttpResponder({
                                c,
                                success: false,
                                message: 'Postimi nuk mund të përditësohet sepse kërkesa është përmbushur.',
                                data: null,
                                code: 403
                            })
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