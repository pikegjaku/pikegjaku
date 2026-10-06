import type { Context } from 'hono'
import type { PostInterface } from '@/ts'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { FindOne, Increment, Insert, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, PostsTable, UsersTable } from '@/data/tables'
import { Console } from '@/controllers/helpers/logs'
import { PostListSelector } from '@/data/constants/Selectors'
import { GetCities, GetCountries } from '@/controllers/helpers/entities'
import { POST_TYPES } from '@/data/constants'

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
                    const post = await Insert<PostInterface>(PostsTable, {
                        Title,
                        Description,
                        City,
                        Type,
                        Country,
                        User,
                        Urgent,
                        BloodGroup:
                            Type === POST_TYPES.BLOOD ? BloodGroup : null,
                        Created_At: CurrentTimestamp(),
                        Updated_At: CurrentTimestamp()
                    })

                    user.Posts += 1

                    await Promise.all([
                        Increment(CitiesTable, City, 'Posts', 1),
                        Increment(CountriesTable, Country, 'Posts', 1),
                        Update(UsersTable, user._id, { Posts: user.Posts })
                    ])

                    const newPost = await FindOne<PostInterface>(PostsTable, {
                        columns: PostListSelector,
                        where: '_id = ?',
                        params: [post?._id],
                        references: {
                            User: UsersTable,
                            Country: CountriesTable,
                            City: CitiesTable
                        }
                    })

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