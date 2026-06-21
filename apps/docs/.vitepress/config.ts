import { defineConfig } from 'vitepress'

import { enConfig } from './config/en'
import { ruConfig } from './config/ru'
import { sharedConfig } from './config/shared'

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
