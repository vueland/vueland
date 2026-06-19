export type CButtonPreset = {
    root?: string[]
    label?: string[]
}

export type CMenuPreset = {
    root?: string[]
    opened?: {
        root?: string[]
    }
    closed?: {
        root?: string[]
    }
}

export type CFieldZone = {
    root?: string[]
    input?: string[]
    label?: string[]
}

type CFieldCompoundState = CFieldZone & {
    focused?: CFieldZone
    filled?: CFieldZone
}

export type CFieldPreset = CFieldZone & {
    focused?: CFieldZone
    filled?: CFieldZone
    error?: CFieldCompoundState
    disabled?: CFieldCompoundState
    readonly?: CFieldCompoundState
    prepended?: CFieldZone
    appended?: CFieldZone
}

type CInputZone = {
    root?: string[]
    label?: string[]
    input?: string[]
    details?: string[]
}

type CInputCompoundState = CInputZone & {
    focused?: CInputZone
    filled?: CInputZone
}

export type CInputPreset = CInputZone & {
    focused?: CInputZone
    filled?: CInputZone
    error?: CInputCompoundState
    disabled?: CInputCompoundState
    readonly?: CInputCompoundState
    prepended?: CInputZone
    appended?: CInputZone
}
