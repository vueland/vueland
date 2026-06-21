import {
    ARIA,
    type AriaCurrent,
    type AriaHaspopup,
    type AriaLive,
} from '@/constants'

type AriaAttrs = Partial<Record<string, string>>

function attr(key: string, value: string | boolean | undefined): AriaAttrs {
    if (value === undefined) return {}
    return { [key]: `${value}` }
}

export function ariaExpanded(value: boolean): AriaAttrs {
    return attr(ARIA.EXPANDED, value)
}

export function ariaHaspopup(value: AriaHaspopup | boolean = true): AriaAttrs {
    return attr(ARIA.HASPOPUP, value)
}

export function ariaControls(id: string | undefined): AriaAttrs {
    return attr(ARIA.CONTROLS, id)
}

export function ariaLabel(value: string | undefined): AriaAttrs {
    return attr(ARIA.LABEL, value)
}

export function ariaLabelledBy(id: string | undefined): AriaAttrs {
    return attr(ARIA.LABELLEDBY, id)
}

export function ariaDescribedBy(id: string | undefined): AriaAttrs {
    return attr(ARIA.DESCRIBEDBY, id)
}

export function ariaErrorMessage(id: string | undefined): AriaAttrs {
    return attr(ARIA.ERRORMESSAGE, id)
}

export function ariaHidden(value: boolean): AriaAttrs {
    return attr(ARIA.HIDDEN, value)
}

export function ariaDisabled(value: boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.DISABLED, true)
}

export function ariaInvalid(value: boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.INVALID, true)
}

export function ariaReadonly(value: boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.READONLY, true)
}

export function ariaRequired(value: boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.REQUIRED, true)
}

export function ariaSelected(value: boolean | undefined): AriaAttrs {
    return attr(ARIA.SELECTED, value)
}

export function ariaMultiselectable(value: boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.MULTISELECTABLE, true)
}

export function ariaLive(value: AriaLive): AriaAttrs {
    return attr(ARIA.LIVE, value)
}

export function ariaCurrent(value: AriaCurrent | boolean | undefined): AriaAttrs {
    if (!value) return {}
    return attr(ARIA.CURRENT, value)
}

export function ariaPressed(value: boolean | undefined): AriaAttrs {
    return attr(ARIA.PRESSED, value)
}

export function ariaChecked(value: boolean | 'mixed' | undefined): AriaAttrs {
    return attr(ARIA.CHECKED, value)
}

export function ariaValue(opts: {
    now?: number
    min?: number
    max?: number
    text?: string
}): AriaAttrs {
    return {
        ...attr(ARIA.VALUENOW, opts.now !== undefined ? String(opts.now) : undefined),
        ...attr(ARIA.VALUEMIN, opts.min !== undefined ? String(opts.min) : undefined),
        ...attr(ARIA.VALUEMAX, opts.max !== undefined ? String(opts.max) : undefined),
        ...attr(ARIA.VALUETEXT, opts.text),
    }
}

export function ariaModal(value = true): AriaAttrs {
    return attr(ARIA.MODAL, value)
}

export function ariaActiveDescendant(id: string | undefined): AriaAttrs {
    return attr(ARIA.ACTIVEDESCENDANT, id)
}

export function ariaAutocomplete(value: 'none' | 'inline' | 'list' | 'both'): AriaAttrs {
    return attr(ARIA.AUTOCOMPLETE, value)
}

export function ariaOrientation(value: 'horizontal' | 'vertical'): AriaAttrs {
    return attr(ARIA.ORIENTATION, value)
}

export function ariaExpandable(
    expanded: boolean,
    opts: { haspopup?: AriaHaspopup | boolean; controls?: string } = {},
): AriaAttrs {
    return {
        ...ariaExpanded(expanded),
        ...(opts.haspopup !== undefined ? ariaHaspopup(opts.haspopup) : {}),
        ...ariaControls(opts.controls),
    }
}
