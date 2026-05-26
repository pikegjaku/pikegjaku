import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { CityModel, CountryModel } from '@/data/models'
import { Console } from '@/controllers/helpers/logs'
import { ObjectId } from '@/controllers/libs/mongo'
import { GetCities, GetCountries } from '@/controllers/helpers/entities'
import { HandleAvatar } from '@/controllers/helpers/users'

import {
    BloodGroupValidation,
    CityValidation,
    UserNameValidation,
    UserSurnameValidation,
    CountryValidation
} from '@/controllers/helpers/validations'

const UpdateUser = async (c: Context) => {
    try {
        const user = c.get('user')

        if (user) {
            const { Name, Surname, Avatar, City, Country, BloodGroup } =
                await c.req.json()

            const [cities, countries] = await Promise.all([
                GetCities(),
                GetCountries()
            ])

            const citiesIds = cities.map((city) => city._id.toString())
            const countriesIds = countries.map((country) =>
                country._id.toString()
            )

            const nameValidation = UserNameValidation(Name)
            const surnameValidation = UserSurnameValidation(Surname)
            const blodTypeValidation = BloodGroupValidation(BloodGroup)
            const cityValidation = CityValidation(City, citiesIds)
            const countryValidation = CountryValidation(Country, countriesIds)

            const isError =
                nameValidation.error ||
                surnameValidation.error ||
                blodTypeValidation.error ||
                cityValidation.error ||
                countryValidation.error

            if (isError)
                return await HttpResponder({
                    c,
                    success: false,
                    message: 'Përdoruesi nuk mund të përditësohet sepse të dhënat e trupit janë të pavlefshme.',
                    code: 400,
                    data: {
                        Name: nameValidation,
                        Surname: surnameValidation,
                        BloodGroup: blodTypeValidation,
                        City: cityValidation,
                        Country: countryValidation
                    }
                })

            const avatarResult = await HandleAvatar({
                userId: user._id.toString(),
                currentAvatar: user.Avatar,
                incomingAvatar: Avatar
            })

            if (!avatarResult.ok)
                return await HttpResponder({
                    c,
                    success: false,
                    message: avatarResult.message,
                    data: null,
                    code: avatarResult.code
                })

            if (String(user.City) !== String(City)) {
                const oldCity = await CityModel.findById(user.City)

                if (oldCity) {
                    oldCity.Users = oldCity.Users - 1
                    await oldCity.save()
                }

                const newCity = await CityModel.findById(City)

                if (newCity) {
                    newCity.Users = newCity.Users + 1
                    await newCity.save()
                }

                user.City = ObjectId(City)
            }

            if (String(user.Country) !== String(Country)) {
                const oldCountry = await CountryModel.findById(user.Country)

                if (oldCountry) {
                    oldCountry.Users = oldCountry.Users - 1
                    await oldCountry.save()
                }

                const newCountry = await CountryModel.findById(Country)

                if (newCountry) {
                    newCountry.Users = newCountry.Users + 1
                    await newCountry.save()
                }

                user.Country = ObjectId(Country)
            }

            user.Name = Name
            user.Surname = Surname
            user.Avatar = avatarResult.path
            user.BloodGroup = BloodGroup
            user.Updated_At = CurrentTimestamp()
            user.ProfileCompleted = true

            await user.save()

            return await HttpResponder({
                c,
                success: true,
                message: 'Përdoruesi u përditësua me sukses.',
                data: user,
                code: 200
            })
        } else
            return await HttpResponder({
                c,
                success: false,
                message: 'User was not found so the user could not be updated!',
                data: null,
                code: 404
            })
    } catch (error) {
        Console.Error('UpdateUser', error)

        return await HttpResponder({
            c,
            success: false,
            message: 'Përdoruesi nuk mund të përditësohet.',
            data: null,
            code: 500
        })
    }
}

export default UpdateUser