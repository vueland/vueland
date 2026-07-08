import { utilsJIT } from '@vueland/utils-jit'
import type { UserConfig } from 'vitepress'

export const githubLink = 'https://github.com/vueland/vueland'

export const sharedConfig: UserConfig = {
    base: '/vueland/',
    cleanUrls: true,
    appearance: true,
    lastUpdated: true,
    vite: {
        plugins: [
            utilsJIT({
                breakpoints: {
                    xs: 0,
                    sm: 680,
                    md: 1024,
                    lg: 1280,
                    xl: 1920,
                    xxl: 2560,
                    tablet: 1400,
                },
            }) as any,
        ],
        css: {
            preprocessorOptions: {
                sass: {
                    api: 'modern',
                },
                scss: {
                    api: 'modern',
                },
            },
        },
    },
    markdown: {
        theme: {
            light: 'one-light',
            // Приглушённая низкоконтрастная тёмная тема — не спорит с
            // брендовыми оттенками и градиентами.
            dark: 'github-dark-dimmed',
        },
        // Рендерим markdown-таблицы как div-структуру `vl-table` (вёрстка на div,
        // темификация нашими токенами). Авторы пишут обычные `| ... |`, на выходе
        // получают наш блок. Позже легко заменить на компонент CTable — правка в
        // одном месте.
        config(md) {
            const align = (token: any) => {
                const style = token.attrGet('style')

                return style ? ` style="${style}"` : ''
            }

            const getTableHeaders = (tokens: any[], idx: number) => {
                const headers: string[] = []

                for (let i = idx + 1; i < tokens.length; i++) {
                    const token = tokens[i]

                    if (token.type === 'tbody_open' || token.type === 'table_close') {
                        break
                    }

                    if (token.type === 'inline' && tokens[i - 1]?.type === 'th_open') {
                        headers.push(String(token.content).trim().toLowerCase())
                    }
                }

                return headers
            }

            const tableClasses = (tokens: any[], idx: number) => {
                const headers = getTableHeaders(tokens, idx)
                const classes = ['vl-table-wrap']

                if (headers.length > 0) {
                    classes.push(`vl-table-wrap--cols-${headers.length}`)
                }

                if (headers.some((header) => header === 'variable' || header === 'переменная')) {
                    classes.push('vl-table-wrap--tokens')
                }

                return classes.join(' ')
            }

            md.renderer.rules.table_open = (tokens: any[], idx: number) =>
                `<div class="${tableClasses(tokens, idx)}"><div class="vl-table" role="table">`
            md.renderer.rules.table_close = () => '</div></div>'
            md.renderer.rules.thead_open = () => '<div class="vl-table__head" role="rowgroup">'
            md.renderer.rules.thead_close = () => '</div>'
            md.renderer.rules.tbody_open = () => '<div class="vl-table__body" role="rowgroup">'
            md.renderer.rules.tbody_close = () => '</div>'
            md.renderer.rules.tr_open = () => '<div class="vl-table__row" role="row">'
            md.renderer.rules.tr_close = () => '</div>'
            md.renderer.rules.th_open = (tokens: any[], idx: number) =>
                `<div class="vl-table__cell vl-table__cell--head" role="columnheader"${align(tokens[idx])}>`
            md.renderer.rules.th_close = () => '</div>'
            md.renderer.rules.td_open = (tokens: any[], idx: number) =>
                `<div class="vl-table__cell" role="cell" ${align(tokens[idx])}>`
            md.renderer.rules.td_close = () => '</div>'
        },
    },
}
