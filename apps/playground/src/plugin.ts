import { faGithub } from '@fortawesome/free-brands-svg-icons'
// Иконки
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'
import { ALIASES } from '@vueland/ui/constants/icons'
import { createFontAwesomeResolver } from '@vueland/ui/resolvers'

// Пресеты
import * as buttonPresets from './presets/button-presets'
import * as inputPresets from './presets/input-presets'
import * as menuPresets from './presets/menu-presets'

import '@vueland/ui/styles/styles.scss'
import '@vueland/ui/styles/lib.scss'
import '@vueland/ui/styles/utils.scss'

const fa = createFontAwesomeResolver({
    defaultPrefix: 'fas',
    icons: {
        'fas:user': faUser,
        'fas:trash': faTrash,
        'fab:github': faGithub,
    },
})

export const ui = createVuelandUI({
    components,
    ssr: false,
    theme: 'light',
    themes: {
        light: {
            primary: '#1976d2',
            onPrimary: '#ffffff',
            secondary: '#1565c0',
            success: '#4caf50',
            error: '#ef231f',
            warning: '#f6892f',
            info: '#0b86cc',
            background: '#f5f5f5',
            surface: '#ffffff',
            surfaceVariant: '#f0f0f0',
            onSurface: '#3d3d3d',
            onSurfaceVariant: '#757575',
            disabled: '#c8c8c8',
            outlineVariant: '#e5e5e5',
            shapeMd: '8px',
        },
        dark: {
            primary: '#90caf9',
            onPrimary: '#000000',
            secondary: '#64b5f6',
            success: '#81c784',
            error: '#ef9a9a',
            warning: '#ffb74d',
            info: '#4fc3f7',
            background: '#121212',
            surface: '#1e1e1e',
            surfaceVariant: '#2a2a2a',
            onSurface: '#e0e0e0',
            onSurfaceVariant: '#9e9e9e',
            disabled: '#555555',
            outlineVariant: '#333333',
            shapeMd: '8px',
        },
        brand: {
            primary: '#e91e63',
            onPrimary: '#ffffff',
            secondary: '#ad1457',
            success: '#4caf50',
            error: '#ef231f',
            warning: '#f6892f',
            info: '#0b86cc',
            background: '#fce4ec',
            surface: '#ffffff',
            surfaceVariant: '#f8bbd0',
            onSurface: '#3d3d3d',
            onSurfaceVariant: '#757575',
            disabled: '#c8c8c8',
            outlineVariant: '#f48fb1',
            shapeMd: '12px',
        },
    },
    icons: {
        sets: { fa },
        aliases: {
            ...ALIASES,
            // dropdown: { ...fa('fas:chevron-down', { source: 'fa' }), size: 16 },
        },
    },
    presets: {
        button: buttonPresets,
        input: inputPresets,
        menu: menuPresets,
    },
})
