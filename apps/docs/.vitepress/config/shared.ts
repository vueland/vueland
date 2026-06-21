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
            dark: 'one-dark-pro',
        },
    },
}
