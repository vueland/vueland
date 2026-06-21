import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import VuelandLayout from './VuelandLayout.vue'
import { inBrowser, useData } from 'vitepress'
import { watch } from 'vue'
import { createVuelandUI } from '@vueland/ui'
import * as components from '@vueland/ui/components'
import '@vueland/ui/styles.css'
import '@vueland/ui/css/lib.css'
import './utils-jit.css'
import './style.scss'
import { ALIASES } from '@vueland/ui/constants'
import type { CInputPreset } from '@vueland/ui/types'
import { createFontAwesomeResolver } from '@vueland/ui/resolvers'

import {
    faUser, faEnvelope, faLock, faPhone, faSearch,
    faHome, faMapMarkerAlt, faLink, faDollarSign, faGlobe,
    faEye, faEyeSlash, faCalendarAlt, faTrash, faPen,
    faKey, faAt, faHashtag, faCode, faBriefcase,
    faShieldAlt, faStar, faHeart, faBell, faCreditCard,
    faPercent, faUserCircle, faCheck, faTimes, faImage,
    faFolder, faFile, faSave, faPlus, faUndo, faRedo,
    faCopy, faCut, faPaste, faExpand, faCog, faShareAlt,
    faSignOutAlt, faBox, faChevronDown, faListUl, faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'

import { faGithub, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'

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
    return {
        root: [color],
        focused: {
            label: [color],
            root: [color]
        },
        filled: { label: [color] },
        input: [],
        error: {
            root: ['text-red'],
            label: ['text-red'],
            filled: {
                label: ['text-red'],
            },
            focused: {
                label: ['text-red'],
            }
        },
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
                    blue:        makeInputPreset('text-blue'),
                    teal:        makeInputPreset('text-teal'),
                    green:       makeInputPreset('text-green'),
                    deepPurple:  makeInputPreset('text-deep-purple'),
                    indigo:      makeInputPreset('text-indigo'),
                    orange:      makeInputPreset('text-orange'),
                    pink:        makeInputPreset('text-pink'),
                    cyan:        makeInputPreset('text-cyan'),
                    // for compound-state demo
                    noCompound: {
                        root: ['text-blue'],
                        focused: { label: ['text-blue'], root: ['text-blue'] },
                        filled: { label: ['text-blue'] },
                        error: {
                            root: ['text-red'],
                            label: ['text-red'],
                        },
                    },
                    withCompound: {
                        root: ['text-blue'],
                        focused: { label: ['text-blue'], root: ['text-blue'] },
                        filled: { label: ['text-blue'] },
                        error: {
                            root: ['text-red'],
                            label: ['text-red'],
                            focused: { label: ['text-blue'], root: ['text-blue'] },
                            filled: { label: ['text-red'] },
                        },
                    },
                },
            },
        })

        app.use(vueland)
    },
} satisfies Theme
