<div align='center'>
    <img
        src='https://cdn.pikegjaku.com/assets/pikegjaku.svg'
        alt='Pikëgjaku Icon'
        height='32px'
    />

   <br />
</div>

<p align='center'>
    Platformë vullnetare e dhurimit të gjakut që lidh dhuruesit me njerëzit në nevojë — aktualisht në Kosovë, Shqipëri dhe Maqedoninë e Veriut.
</p>

## Rreth Projektit

Pikëgjaku është një platformë komunitare që lidh dhuruesit vullnetarë të gjakut me pacientët që kanë nevojë urgjente për transfuzion gjaku. Kur dikush ka nevojë për gjak, krijon një kërkesë duke specifikuar grupin e gjakut dhe vendndodhjen, dhe dhuruesit përkatës në afërsi njoftohen menjëherë.

## Veçoritë

- **Urgjenca** — Posto nevojat urgjente për gjak me grupin, vendndodhjen dhe detajet
- **Njoftimet e Mençura** — Dhuruesit njoftohen bazuar në grupin përkatës të gjakut dhe afërsinë
- **Qendrat e Dhurimit** — Drejtori e qendrave të dhurimit të gjakut me kontakte dhe vendndodhje
- **Shumë Shtete** — Mbështet Kosovën, Shqipërinë dhe Maqedoninë e Veriut me 30+ qytete
- **Shumëgjuhësh** — Ndërtuar me mbështetje të plotë i18n, duke filluar me shqipen

## Teknologjitë

| Shtresa               | Teknologjitë                                                    |
| --------------------- | --------------------------------------------------------------- |
| **Aplikacioni Mobil** | React Native, Expo, Expo Router, Zustand, twrnc, Phosphor Icons |
| **API**               | Hono.js, Bun, MongoDB (Mongoose), Cloudflare, Sharp, JWT        |
| **Uebi**              | Astro 6, Tailwind 4 (deployed to Cloudflare Pages)              |
| **Paneli Admin**      | React, Vite                                                     |
| **Shared**            | TypeScript, i18n, validacione, konstante, helpers               |

## Struktura e Projektit

```
pikegjaku/
├── app/               # Aplikacioni mobil me React Native + Expo
├── api/               # Backend me Hono.js (Bun runtime)
├── www/               # Faqja marketing me Astro
├── admin/             # Paneli admin me React + Vite
├── packages/
│   └── shared/        # @pikegjaku/shared — konstante, helpers, validacione, i18n
└── package.json       # Root i workspace-it
```

## Parakushtet

- [Node.js](https://nodejs.org/) (v20+)
- [Bun](https://bun.sh/) (për API-n)
- [MongoDB](https://www.mongodb.com/) (lokalisht ose instancë cloud)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Si të Filloni

### 1. Klononi repository-n

```bash
git clone https://github.com/bfzli/pikegjaku.git
cd pikegjaku
```

### 2. Instaloni varësitë

```bash
bun install
```

### 3. Konfiguroni variablat e mjedisit

Kopjoni skedarët `.env.example` në çdo workspace dhe plotësoni vlerat e nevojshme:

```bash
cp api/.env.example api/.env
cp app/.env.example app/.env
cp www/.env.example www/.env
```

### 4. Nisni workspace-t

Të gjitha skriptat ekzekutohen nga root-i i projektit:

```bash
# API (porti 9999)
bun run api:dev

# Aplikacioni Mobil (Expo)
bun run app:start

# Uebi (Astro, porti 2010)
bun run www:dev

# Paneli Admin (Vite)
bun run admin:dev
```

### Formatimi & Linting

```bash
bun run format    # Prettier + ESLint fix
bun run lint      # ESLint check
bun run check     # Format + lint
```

## Faqja Marketing (www)

E ndërtuar me Astro 6 + Tailwind 4, e publikuar në Cloudflare Pages.

### Komandat

```bash
bun run www:dev       # Server dev (porti 2010)
bun run www:build     # Ndërton faqen statike në www/dist
bun run www:preview   # Parashikon faqen e ndërtuar
bun run www:tsc       # Kontroll i tipeve
bun run www:lint      # Lint
```

### Variablat e Mjedisit

Vendosi në cilësimet e projektit në Cloudflare Pages (dhe në `www/.env` për zhvillim lokal):

| Variabla            | E detyrueshme | Qëllimi                                       |
| ------------------- | ------------- | --------------------------------------------- |
| `PUBLIC_API_URL`    | po            | URL-ja bazë e API-së së Pikëgjakut (waitlist) |
| `PUBLIC_GA_ID`      | jo            | ID-ja e matjes së Google Analytics            |
| `PUBLIC_HOTJAR_ID`  | jo            | ID-ja e faqes në Hotjar (numerike)            |
| `PUBLIC_CLARITY_ID` | jo            | ID-ja e projektit në Microsoft Clarity        |

### Publikimi në Cloudflare Pages

**Cilësimet e ndërtimit:**

- Framework preset: **None**
- Build command: `bun run www:build`
- Build output directory: `www/dist`
- Root directory: _(bosh)_
- Environment variables: shih tabelën më lart

**Routing:**

- `public/_redirects` heq trailing slash-et (përputhet me `trailingSlash: 'never'` në `astro.config.mjs`).
- `public/robots.txt` lejon crawler-at kryesorë të AI dhe motorëve të kërkimit dhe tregon sitemap-in.
- `@astrojs/sitemap` gjeneron `sitemap-index.xml` gjatë ndërtimit.

### Faqet

- `/` — Faqja kryesore + regjistrim në waitlist
- `/privatesia` — Politika e privatësisë
- `/kushtet-e-sherbimit` — Kushtet e shërbimit
- `/404` — Nuk u gjet

## Kontributi

Kontributet janë të mirëpritura! Sigurohuni që:

1. Ndiqni konventat ekzistuese të kodit
2. Përdorni `@/` path aliases — asnjëherë importe relative
3. Centralizoni tipet në `@/ts/`
4. Përdorni sistemin e përkthimeve për çdo tekst të dukshëm nga përdoruesi
5. Ekzekutoni `bun run check` para se të dërgoni një PR

## Licenca

Ky projekt është me burim të hapur nën [Licencën MIT](LICENSE).
