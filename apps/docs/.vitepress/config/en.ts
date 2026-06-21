import { createNav, createSidebar } from './links'
import { getMessages } from './i18n'
import { githubLink } from './shared'

const t = getMessages('en')

export const enConfig = {
    label: t.label,
    lang: t.lang,
    link: '/en/',
    title: t.title,
    description: t.description,
    themeConfig: {
        logo: '/logo.png',
        siteTitle: 'Vueland',
        nav: createNav('en'),
        sidebar: createSidebar('en'),
        outline: {
            label: t.theme.outline,
            level: 'deep' as const
        },
        docFooter: {
            prev: t.theme.docFooterPrev,
            next: t.theme.docFooterNext,
        },
        darkModeSwitchLabel: t.theme.darkModeSwitchLabel,
        lightModeSwitchTitle: t.theme.lightModeSwitchTitle,
        darkModeSwitchTitle: t.theme.darkModeSwitchTitle,
        returnToTopLabel: t.theme.returnToTopLabel,
        sidebarMenuLabel: t.theme.sidebarMenuLabel,
        langMenuLabel: t.theme.langMenuLabel,
        socialLinks: [{
            icon: 'github' as const,
            link: githubLink
        }],
        search: {
            provider: 'local' as const
        },
    },
}
