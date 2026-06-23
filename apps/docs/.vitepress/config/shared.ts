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
      utilsJIT({ outFile: './.vitepress/theme/utils-jit.css' }) as any,
        ],
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

            md.renderer.rules.table_open = () =>
                '<div class="vl-table-wrap"><div class="vl-table" role="table">'
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
                `<div class="vl-table__cell" role="cell"${align(tokens[idx])}>`
            md.renderer.rules.td_close = () => '</div>'
        },
    },
}
