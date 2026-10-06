import type { Context } from 'hono'

import { HttpResponder } from '@/controllers/helpers/http'
import { CurrentTimestamp } from '@/data/dates'
import { Increment, Update } from '@/controllers/libs/d1'
import { CitiesTable, CountriesTable, UsersTable } from '@/data/tables'
import { Console } from '@/controllers/helpers/logs'
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

            const counters: Array<Promise<void>> = []

            if (String(user.City) !== String(City)) {
                counters.push(
                    Increment(CitiesTable, user.City, 'Users', -1),
                    Increment(CitiesTable, City, 'Users', 1)
                )

                user.City = City
            }

            if (String(user.Country) !== String(Country)) {
                counters.push(
                    Increment(CountriesTable, user.Country, 'Users', -1),
                    Increment(CountriesTable, Country, 'Users', 1)
                )

                user.Country = Country
            }

            user.Name = Name
            user.Surname = Surname
            user.Avatar = avatarResult.path
            user.BloodGroup = BloodGroup
            user.Updated_At = CurrentTimestamp()
            user.ProfileCompleted = true

            await Promise.all([
                ...counters,
                Update(UsersTable, user._id, {
                    City: user.City,
                    Country: user.Country,
                    Name: user.Name,
                    Surname: user.Surname,
                    Avatar: user.Avatar,
                    BloodGroup: user.BloodGroup,
                    Updated_At: user.Updated_At,
                    ProfileCompleted: user.ProfileCompleted
                })
            ])

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