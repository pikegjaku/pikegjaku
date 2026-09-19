import { env } from '@goenvless/env/server'
import Client from '@/controllers/libs/openemail/Client'
import WelcomeTemplate from '@/controllers/libs/openemail/templates/WelcomeTemplate'
import Console from '@/controllers/helpers/logs/Console'

const SendWelcomeEmail = async (email: string): Promise<false | string> => {
    try {
        const sent = await Client().emails.send({
            from: env.OPENEMAIL_FROM,
            to: email,
            subject: 'Mirë se vjen në Pikëgjaku',
            html: WelcomeTemplate(email),
            text: `Dhuro gjak — sot për dikë, nesër për ty.

Faleminderit që u regjistrove. Të kemi shtuar në listën e pritjes me adresën ${email}.

Pikëgjaku lidh njerëzit që duan të dhurojnë gjak me ata që kanë nevojë për të. Kur dikush ka nevojë urgjente, dhuruesit me grup gjaku përkatës dhe afër tij njoftohen menjëherë.

Do të të shkruajmë në këtë adresë sapo platforma të jetë gati. Deri atëherë nuk do të marrësh asnjë email tjetër nga ne.

https://pikegjaku.com`,
            tags: { type: 'waitlist-welcome' }
        })

        return sent?.id || false
    } catch (error) {
        Console.Error('SendWelcomeEmail', error)
        return false
    }
}

export default SendWelcomeEmail