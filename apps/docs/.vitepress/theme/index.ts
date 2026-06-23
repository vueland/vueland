import {
    faGithub,
    faGoogle,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
    faAt,
    faBell,
    faBox,
    faBriefcase,
    faCalendarAlt,
    faCheck,
    faChevronDown,
    faCode,
    faCog,
    faCopy,
    faCreditCard,
    faCut,
    faDollarSign,
    faEllipsisV,
    faEnvelope,
    faExpand,
    faEye,
    faEyeSlash,
    faFile,
    faFolder,
    faGlobe,
    faHashtag,
    faHeart,
    faHome,
    faImage,
    faKey,
    faLink,
    faListUl,
    faLock,
    faMapMarkerAlt,
    faPaste,
    faPen,
    faPercent,
    faPhone,
    faPlus,
    faRedo,
    faSave,
    faSearch,
    faShareAlt,
    faShieldAlt,
    faSignOutAlt,
    faStar,
    faTimes,
    faTrash,
    faUndo,
    faUser,
    faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'
import { ALIASES } from '@vueland/ui/constants'
import { createFontAwesomeResolver } from '@vueland/ui/resolvers'
import type { CInputPreset } from '@vueland/ui/types'
import {
    inBrowser,
    type Theme,
    useData,
} from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { watch } from 'vue'

import VuelandLayout from './VuelandLayout.vue'

import '@vueland/ui/styles/styles.scss'
import '@vueland/ui/styles/lib.scss'
import '@vueland/ui/styles/utils.scss'
import './utils-jit.css'
import './style.scss'

const fa = createFontAwesomeResolver({
    defaultPrefix: 'fas',
    icons: {
        'fas:user': faUser,
        'fas:envelope': faEnvelope,
        'fas:lock': faLock,
        'fas:phone': faPhone,
        'fas:search': faSearch,
        'fas:home': faHome,
        'fas:map-marker-alt': faMapMarkerAlt,
        'fas:link': faLink,
        'fas:dollar-sign': faDollarSign,
        'fas:globe': faGlobe,
        'fas:eye': faEye,
        'fas:eye-slash': faEyeSlash,
        'fas:calendar-alt': faCalendarAlt,
        'fas:trash': faTrash,
        'fas:pen': faPen,
        'fas:key': faKey,
        'fas:at': faAt,
        'fas:hashtag': faHashtag,
        'fas:code': faCode,
        'fas:briefcase': faBriefcase,
        'fas:shield-alt': faShieldAlt,
        'fas:star': faStar,
        'fas:heart': faHeart,
        'fas:bell': faBell,
        'fas:credit-card': faCreditCard,
        'fas:percent': faPercent,
        'fas:user-circle': faUserCircle,
        'fas:check': faCheck,
        'fas:times': faTimes,
        'fas:image': faImage,
        'fas:folder': faFolder,
        'fas:file': faFile,
        'fas:save': faSave,
        'fas:plus': faPlus,
        'fas:undo': faUndo,
        'fas:redo': faRedo,
        'fas:copy': faCopy,
        'fas:cut': faCut,
        'fas:paste': faPaste,
        'fas:expand': faExpand,
        'fas:cog': faCog,
        'fas:share-alt': faShareAlt,
        'fas:sign-out-alt': faSignOutAlt,
        'fas:box': faBox,
        'fas:chevron-down': faChevronDown,
        'fas:list-ul': faListUl,
        'fas:ellipsis-v': faEllipsisV,
        'fab:github': faGithub,
        'fab:google': faGoogle,
        'fab:twitter': faTwitter,
    },
})

function makeInputPreset(color: string): CInputPreset {
    // `field` colors the .c-field border (currentColor), `label` the floating label.
    return {
        base: { field: [color], label: [color] },
        focused: { field: [color], label: [color] },
        filled: { field: [color], label: [color] },
        error: {
            field: ['text-red'],
            label: ['text-red'],
            details: ['text-red'],
        },
        readonly: { field: ['text-grey'], label: ['text-grey'] },
    }
}

export default {
    extends: DefaultTheme,
    Layout: VuelandLayout,
    setup() {
        if (inBrowser) {
            const { isDark } = useData()
            watch(isDark, (dark) => {
                document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
            }, { immediate: true })
        }
    },
    enhanceApp({ app }) {
        const vueland = createVuelandUI({
            components,
            ssr: true,
            icons: {
                sets: { fa },
                aliases: { ...ALIASES },
            },
            presets: {
                input: {
                    blue: makeInputPreset('text-blue'),
                    teal: makeInputPreset('text-teal'),
                    green: makeInputPreset('text-green'),
                    deepPurple: makeInputPreset('text-deep-purple'),
                    indigo: makeInputPreset('text-indigo'),
                    orange: makeInputPreset('text-orange'),
                    pink: makeInputPreset('text-pink'),
                    cyan: makeInputPreset('text-cyan'),
                },
            },
        })

        app.use(vueland)
    },
} satisfies Theme
