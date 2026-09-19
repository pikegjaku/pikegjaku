import type { EmailLayoutProps } from '@/ts'

import Logo from '@/controllers/libs/openemail/templates/Logo'
import { BRAND } from '@/data/constants'

const EmailLayout = ({ preheader, heading, body }: EmailLayoutProps): string =>
    `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="sq">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${heading}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&amp;family=Host+Grotesk:wght@400;500&amp;display=swap" rel="stylesheet" />
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: ${BRAND.RED}; }
    @media only screen and (max-width: 600px) {
        .wrapper { width: 100% !important; }
        .px { padding-left: 24px !important; padding-right: 24px !important; }
        .h1 { font-size: 30px !important; line-height: 34px !important; }
    }
</style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.BLACK};">
<div style="display:none;font-size:1px;color:${BRAND.BLACK};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.BLACK};">
<tr>
<td align="center" style="padding:48px 16px;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper" style="width:600px;max-width:600px;background-color:${BRAND.SURFACE};border:1px solid ${BRAND.BORDER};border-radius:16px;">
<tr>
<td class="px" style="padding:40px 40px 0 40px;">${Logo()}</td>
</tr>
<tr>
<td class="px" style="padding:32px 40px 0 40px;">
<h1 class="h1" style="margin:0;font-family:${BRAND.HEADING_FONT};font-size:38px;line-height:40px;font-weight:400;letter-spacing:-0.03em;color:${BRAND.TEXT};">${heading}</h1>
</td>
</tr>
<tr>
<td class="px" style="padding:20px 40px 0 40px;font-family:${BRAND.BODY_FONT};font-size:15px;line-height:23px;color:${BRAND.TEXT_MUTED};">${body}</td>
</tr>
<tr>
<td class="px" style="padding:36px 40px 0 40px;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:${BRAND.BORDER};">&nbsp;</td></tr></table>
</td>
</tr>
<tr>
<td class="px" style="padding:24px 40px 40px 40px;font-family:${BRAND.BODY_FONT};font-size:12px;line-height:18px;color:#5c5c5c;">
Pikëgjaku &middot; <a href="${BRAND.SITE}" style="color:#5c5c5c;text-decoration:underline;">pikegjaku.com</a><br />
Iniciativë vullnetare e dhurimit të gjakut në Kosovë, Shqipëri dhe Maqedoninë e Veriut.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`

export default EmailLayout