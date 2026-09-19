import EmailLayout from '@/controllers/libs/openemail/templates/EmailLayout'
import EscapeHtml from '@/controllers/helpers/generals/EscapeHtml'
import { BRAND } from '@/data/constants'

const WelcomeTemplate = (email: string): string => {
    const safe = EscapeHtml(email)

    return EmailLayout({
        preheader: 'Je në listë. Do të të njoftojmë sapo Pikëgjaku të lansohet.',
        heading: 'Dhuro gjak — sot për dikë, nesër për ty.',
        body: `<p style="margin:0 0 16px 0;">Faleminderit që u regjistrove. Të kemi shtuar në listën e pritjes me adresën <span style="color:${BRAND.TEXT};">${safe}</span>.</p>
<p style="margin:0 0 16px 0;">Pikëgjaku lidh njerëzit që duan të dhurojnë gjak me ata që kanë nevojë për të. Kur dikush ka nevojë urgjente, dhuruesit me grup gjaku përkatës dhe afër tij njoftohen menjëherë.</p>
<p style="margin:0 0 28px 0;">Do të të shkruajmë në këtë adresë sapo platforma të jetë gati. Deri atëherë nuk do të marrësh asnjë email tjetër nga ne.</p>
<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>
<td style="background-color:${BRAND.RED};border-radius:12px;">
<a href="${BRAND.SITE}" style="display:inline-block;padding:11px 22px;font-family:${BRAND.BODY_FONT};font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;">Vizito pikegjaku.com</a>
</td>
</tr></table>`
    })
}

export default WelcomeTemplate