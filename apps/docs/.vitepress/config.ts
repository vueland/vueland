import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'

import { enConfig } from './config/en'
import { ruConfig } from './config/ru'
import { sharedConfig } from './config/shared'


const initialThemeStyle = readFileSync(new URL('./theme/initial-theme.css', import.meta.url), 'utf-8')
const initialThemeScript = readFileSync(new URL('./theme/initial-theme.js', import.meta.url), 'utf-8')

export default defineConfig({
    ...sharedConfig,

    // Фавиконки общие для всех локалей — лежат в `public`, отдаются из-под base `/vueland/`.
    head: [
        ['style', {}, initialThemeStyle],
        ['script', { id: 'vueland-initial-theme' }, initialThemeScript],
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/vueland/favicon.ico' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/vueland/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/vueland/favicon-16x16.png' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/vueland/apple-touch-icon.png' }],
        ['link', { rel: 'manifest', href: '/vueland/site.webmanifest' }],
    ],

    locales: {
        root: {
            label: 'Русский',
            lang: 'ru-RU',
            title: 'Vueland',
            description: 'Современная frontend-платформа для Vue',
            link: '/ru/',
            themeConfig: ruConfig.themeConfig,
        },

        en: {
            ...enConfig,
            link: '/en/',
            description: 'Modern frontend platform for Vue',
        },
    },
})
