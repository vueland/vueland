import { defineConfig } from 'vitepress'
import { sharedConfig } from './config/shared'
import { enConfig } from './config/en'
import { ruConfig } from './config/ru'

export default defineConfig({
    ...sharedConfig,

    locales: {
        root: {
            label: 'Русский',
            lang: 'ru-RU',
            title: 'Vueland',
            description: 'Современная frontend-платформа для Vue 3',
            link: '/ru/',
            themeConfig: ruConfig.themeConfig,
        },

        en: {
            ...enConfig,
            link: '/en/',
        },
    },
})
