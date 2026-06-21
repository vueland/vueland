export const locales = ['en', 'ru'] as const

export type Locale = (typeof locales)[number]

export type LocaleMessages = {
    label: string
    lang: string
    title: string
    description: string

    nav: {
        guide: string
        components: string
        utilities: string
        settings: string
        plugins: string
    }

    sidebar: {
        guide: {
            title: string
            gettingStarted: string
            theming: string
            icons: string
            presets: string
            breakpoints: string
        }

        components: string

        settings: {
            title: string
            introduction: string
            cssVars: string
        }

        utilities: {
            title: string
        }

        plugins: {
            title: string
        }
    }

    theme: {
        outline: string
        docFooterPrev: string
        docFooterNext: string
        darkModeSwitchLabel: string
        lightModeSwitchTitle: string
        darkModeSwitchTitle: string
        returnToTopLabel: string
        sidebarMenuLabel: string
        langMenuLabel: string
    }
}

export const messages: Record<Locale, LocaleMessages> = {
    en: {
        label: 'English',
        lang: 'en-US',
        title: 'Vueland',
        description: 'Modern frontend platform for Vue 3',

        nav: {
            guide: 'Guide',
            components: 'Components',
            utilities: 'Utilities',
            settings: 'Settings',
            plugins: 'Plugins',
        },

        sidebar: {
            guide: {
                title: 'Guide',
                gettingStarted: 'Getting started',
                theming: 'Theming',
                icons: 'Icons',
                presets: 'Presets',
                breakpoints: 'Breakpoints',
            },

            components: 'Components',

            settings: {
                title: 'Global settings',
                introduction: 'Introduction',
                cssVars: 'CSS variables',
            },

            utilities: {
                title: 'Utility classes',
            },

            plugins: {
                title: 'Plugins',
            },
        },

        theme: {
            outline: 'On this page',
            docFooterPrev: 'Previous page',
            docFooterNext: 'Next page',
            darkModeSwitchLabel: 'Appearance',
            lightModeSwitchTitle: 'Switch to light theme',
            darkModeSwitchTitle: 'Switch to dark theme',
            returnToTopLabel: 'Return to top',
            sidebarMenuLabel: 'Menu',
            langMenuLabel: 'Change language',
        },
    },

    ru: {
        label: 'Русский',
        lang: 'ru-RU',
        title: 'Vueland',
        description: 'Современная frontend-платформа для Vue 3',

        nav: {
            guide: 'Руководство',
            components: 'Компоненты',
            utilities: 'Утилиты',
            settings: 'Настройки',
            plugins: 'Плагины',
        },

        sidebar: {
            guide: {
                title: 'Руководство',
                gettingStarted: 'Начало работы',
                theming: 'Темификация',
                icons: 'Иконки',
                presets: 'Пресеты',
                breakpoints: 'Брейкпоинты',
            },

            components: 'Компоненты',

            settings: {
                title: 'Глобальные настройки',
                introduction: 'Введение',
                cssVars: 'CSS переменные',
            },

            utilities: {
                title: 'Утилитарные классы',
            },

            plugins: {
                title: 'Плагины',
            },
        },

        theme: {
            outline: 'Содержание страницы',
            docFooterPrev: 'Предыдущая страница',
            docFooterNext: 'Следующая страница',
            darkModeSwitchLabel: 'Оформление',
            lightModeSwitchTitle: 'Переключить на светлую тему',
            darkModeSwitchTitle: 'Переключить на тёмную тему',
            returnToTopLabel: 'Наверх',
            sidebarMenuLabel: 'Меню',
            langMenuLabel: 'Сменить язык',
        },
    },
}

export function getMessages(locale: Locale): LocaleMessages {
    return messages[locale]
}

export function localePrefix(locale: Locale): `/${Locale}` {
    return `/${locale}`
}
