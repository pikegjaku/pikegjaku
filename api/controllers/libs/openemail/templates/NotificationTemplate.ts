import type { NotificationTemplateProps } from '@/ts'

import EmailLayout from '@/controllers/libs/openemail/templates/EmailLayout'
import EscapeHtml from '@/controllers/helpers/generals/EscapeHtml'
import { BRAND } from '@/data/constants'

const NotificationTemplate = ({
    email,
    total,
    date
}: NotificationTemplateProps): string => {
    const safe = EscapeHtml(email)

    return EmailLayout({
        preheader: `${safe} u regjistrua në listën e pritjes.`,
        heading: 'Regjistrim i ri.',
        body: `<p style="margin:0 0 24px 0;">Dikush u shtua në listën e pritjes.</p>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#141414;border:1px solid ${BRAND.BORDER};border-radius:12px;">
<tr><td style="padding:18px 20px;font-family:${BRAND.BODY_FONT};font-size:12px;line-height:16px;color:${BRAND.TEXT_MUTED};letter-spacing:0.04em;text-transform:uppercase;">Email</td></tr>
<tr><td style="padding:0 20px 18px 20px;font-family:${BRAND.BODY_FONT};font-size:17px;line-height:22px;color:${BRAND.TEXT};"><a href="mailto:${safe}" style="color:${BRAND.TEXT};text-decoration:none;">${safe}</a></td></tr>
<tr><td style="padding:0 20px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${BRAND.BORDER};">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:18px 20px 6px 20px;font-family:${BRAND.BODY_FONT};font-size:12px;line-height:16px;color:${BRAND.TEXT_MUTED};letter-spacing:0.04em;text-transform:uppercase;">Data</td></tr>
<tr><td style="padding:0 20px 18px 20px;font-family:${BRAND.BODY_FONT};font-size:15px;line-height:20px;color:${BRAND.TEXT};">${date}</td></tr>
<tr><td style="padding:0 20px;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${BRAND.BORDER};">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:18px 20px 6px 20px;font-family:${BRAND.BODY_FONT};font-size:12px;line-height:16px;color:${BRAND.TEXT_MUTED};letter-spacing:0.04em;text-transform:uppercase;">Gjithsej në listë</td></tr>
<tr><td style="padding:0 20px 18px 20px;font-family:${BRAND.HEADING_FONT};font-size:28px;line-height:32px;letter-spacing:-0.02em;color:${BRAND.RED};">${total}</td></tr>
</table>
<p style="margin:24px 0 0 0;font-size:13px;">Përgjigju këtij emaili për t'i shkruar drejtpërdrejt.</p>`
    })
}

export default NotificationTemplate