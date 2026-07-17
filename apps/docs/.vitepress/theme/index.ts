import {
    faGithub,
    faGoogle,
    faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import {
    faArrowLeft,
    faArrowRight,
    faArrowUpRightFromSquare,
    faAt,
    faBan,
    faBell,
    faBolt,
    faBookmark,
    faBox,
    faBriefcase,
    faCalendarAlt,
    faCartPlus,
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
import type {
    CButtonPreset,
    CDatePickerPreset,
    CInputPreset,
    CProgressCircularPreset,
    CProgressLinearPreset,
} from '@vueland/ui/types'
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
import 'virtual:utils-jit.css'
import './style.scss'

const fa = createFontAwesomeResolver({
    defaultPrefix: 'fas',
    icons: {
        'fas:user': faUser,
        'fas:ban': faBan,
        'fas:envelope': faEnvelope,
        'fas:lock': faLock,
        'fas:cart-plus': faCartPlus,
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
        'fas:arrow-left': faArrowLeft,
        'fas:arrow-right': faArrowRight,
        'fas:arrow-up-right-from-square': faArrowUpRightFromSquare,
        'fas:hashtag': faHashtag,
        'fas:bolt': faBolt,
        'fas:bookmark': faBookmark,
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
    // Пресет поля вкладывается по значению; `root` красит рамку .c-field
    // (currentColor), `label` — плавающий лейбл. Состояния резолвит сам CField.
    return {
        base: {
            field: {
                base: { root: [color], label: [color] },
                focused: { root: [color], label: [color] },
                filled: { root: [color], label: [color] },
                error: { root: ['text-red'], label: ['text-red'] },
                readonly: { root: ['text-grey'], label: ['text-grey'] },
            },
        },
        error: { details: ['text-red'] },
    }
}

function makeDateInputPreset(color: string, datePicker: CDatePickerPreset): CInputPreset {
    const input = makeInputPreset(color)

    return {
        ...input,
        base: {
            ...input.base,
            datePicker,
        },
    }
}

const datePickerNeonPreset: CDatePickerPreset = {
    base: {
        root: ['radius-12'],
        display: ['bg-indigo', 'text-white'],
        week: ['text-indigo'],
        cell: ['radius-8'],
    },
    months: {
        cell: ['radius-10'],
    },
    years: {
        cell: ['radius-10'],
    },
}

const datePickerAgendaPreset: CDatePickerPreset = {
    base: {
        root: ['radius-8'],
        display: ['bg-teal', 'text-white'],
        week: ['text-teal'],
        cell: ['radius-6'],
    },
    dates: {
        cell: ['fw-semi-bold'],
    },
    months: {
        cell: ['fw-semi-bold'],
    },
    years: {
        cell: ['fw-semi-bold'],
    },
}

const dateInputBookingPreset = makeDateInputPreset('text-teal', datePickerAgendaPreset)
const dateInputCampaignPreset = makeDateInputPreset('text-indigo', datePickerNeonPreset)

// Демо для страницы CCheckbox: вложенный пресет чекбокса лежит в base-снимке
// инпута — там же, где field. Состояния резолвит сам чекбокс.
const consentCheckboxPreset: CInputPreset = {
    base: {
        checkbox: {
            base: {
                icon: ['text-blue-grey'],
                label: ['text-blue-grey'],
            },
            checked: {
                icon: ['text-indigo'],
                label: ['text-indigo', 'fw-semi-bold'],
            },
            indeterminate: { icon: ['text-indigo'] },
            focused: { icon: ['text-indigo-darken-2'] },
            error: {
                icon: ['text-red'],
                label: ['text-red'],
            },
            disabled: {
                icon: ['text-grey-lighten-1'],
                label: ['text-grey-lighten-1'],
            },
        },
    },
    error: { details: ['text-red'] },
}

// Демо для страниц CProgressCircular / CProgressLinear: complete перекрашивает
// прогресс в зелёный, когда value доходит до 100. Кольцо и подложка — SVG,
// text-* красит их через currentColor.
const uploadProgressPreset: CProgressCircularPreset = {
    base: {
        underlay: ['text-grey'],
        overlay: ['text-indigo'],
        info: ['text-grey'],
    },
    complete: {
        overlay: ['text-green'],
        info: ['text-green'],
    },
}

const downloadProgressPreset: CProgressLinearPreset = {
    base: { bar: ['bg-indigo'] },
    complete: { bar: ['bg-green'] },
}

// Демо для страницы CBtn: полный пресет со состояниями.
const saveButtonPreset: CButtonPreset = {
    base: { root: ['bg-indigo', 'hover:bg-indigo-darken-1', 'text-white', 'elevation-2'] },
    active: { root: ['bg-indigo-darken-2', 'text-white', 'elevation-0'] },
    loading: { root: ['bg-indigo-lighten-2', 'text-white', 'elevation-0'] },
    disabled: { root: ['bg-grey-lighten-1', 'text-grey-darken-1'] },
}

// Демо сочетания пресета и пропа color: пресет отвечает за форму и типографику,
// цвет остаётся за пропом.
const pillButtonPreset: CButtonPreset = {
    base: { root: ['radius-16', 'px-6', 'text-uppercase', 'elevation-3'] },
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
                    dateBooking: dateInputBookingPreset,
                    dateCampaign: dateInputCampaignPreset,
                    consent: consentCheckboxPreset,
                },
                progress: {
                    upload: uploadProgressPreset,
                    download: downloadProgressPreset,
                },
                button: {
                    save: saveButtonPreset,
                    pill: pillButtonPreset,
                },
                datePicker: {
                    neon: datePickerNeonPreset,
                    agenda: datePickerAgendaPreset,
                },
            },
        })

        app.use(vueland)
    },
} satisfies Theme
