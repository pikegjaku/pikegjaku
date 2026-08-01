import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: 'https://pikegjaku.com',
    trailingSlash: 'never',
    devToolbar: {
        enabled: false
    },
    server: {
        port: parseInt(process.env.PORT || '4321')
    },
    integrations: [sitemap()],
    vite: {
        plugins: [tailwindcss()]
    }
})