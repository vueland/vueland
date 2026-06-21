import type { DefaultTheme } from 'vitepress'
import type { Locale } from './i18n'
import { getMessages, localePrefix } from './i18n'
// Locales
import * as components from './components'
import * as utilities from './utilities'
import * as plugins from './plugins'

function link(locale: Locale, path: string): string {
    return `${localePrefix(locale)}${path}`
}

function item(locale: Locale, section: string, source): DefaultTheme.SidebarItem {
    return {
        text: source.title,
        link: link(locale, `/${section}/${source.file}`),
    }
}

export function createNav(locale: Locale): DefaultTheme.NavItem[] {
    const t = getMessages(locale)

    return [
        { text: t.nav.guide, link: link(locale, '/guide/getting-started') },
        { text: t.nav.components, link: link(locale, '/components/') },
        { text: t.nav.utilities, link: link(locale, '/utilities/') },
        { text: t.nav.settings, link: link(locale, '/settings/') },
        {
            text: t.nav.plugins,
            link: link(locale, '/plugins/')
        },
    ]
}

export function createSidebar(locale: Locale): DefaultTheme.Sidebar {
    const t = getMessages(locale)
    const p = localePrefix(locale)

    return {
        [`${p}/guide/`]: [
            {
                text: t.sidebar.guide.title,
                items: [
                    {
                        text: t.sidebar.guide.gettingStarted,
                        link: link(locale, '/guide/getting-started'),
                    },
                    {
                        text: t.sidebar.guide.theming,
                        link: link(locale, '/guide/theming'),
                    },
                    {
                        text: t.sidebar.guide.icons,
                        link: link(locale, '/guide/icons'),
                    },
                    {
                        text: t.sidebar.guide.presets,
                        link: link(locale, '/guide/presets'),
                    },
                    {
                        text: t.sidebar.guide.breakpoints,
                        link: link(locale, '/guide/breakpoints'),
                    },
                ],
            },
        ],

        [`${p}/components/`]: components[locale].map((group) => ({
            text: group.title,
            items: group.items.map((source) => item(locale, 'components', source)),
        })),

        [`${p}/settings/`]: [
            {
                text: t.sidebar.settings.title,
                items: [
                    {
                        text: t.sidebar.settings.introduction,
                        link: link(locale, '/settings/'),
                    },
                    {
                        text: t.sidebar.settings.cssVars,
                        link: link(locale, '/settings/css-vars'),
                    },
                ],
            },
        ],

        [`${p}/utilities/`]: [
            {
                text: t.sidebar.utilities.title,
                link: link(locale, '/utilities/'),
                items: utilities[locale].map((source) => item(locale, 'utilities', source)),
            },
        ],

        [`${p}/plugins/`]: [
            {
                text: t.sidebar.plugins.title,
                link: link(locale, '/plugins/'),
            },
            ...plugins[locale].map((group) => ({
                text: group.title,
                collapsed: true,
                items: group.items.map((source) => item(locale, 'plugins', source)),
            })),
        ],
    }
}
