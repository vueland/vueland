import {
    type AllowedComponentProps,
    type ComponentCustomProps,
    type ComponentObjectPropsOptions,
    type ComponentOptionsWithObjectProps,
    type ComputedOptions,
    type DefineComponent,
    defineComponent as _defineComponent,
    type ExtractDefaultPropTypes,
    type ExtractPropTypes,
    type MethodOptions,
    type SlotsType,
    type VNode,
    type VNodeChild,
    type VNodeProps,
} from 'vue'

type ComponentVueProps =
    VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps

export type RawSlots = Record<string, unknown>

export type Slot<T> =
    [T] extends [never]
        ? () => VNodeChild
        : (arg: T) => VNodeChild

export type VueSlot<T> =
    [T] extends [never]
        ? () => VNode[]
        : (arg: T) => VNode[]

export type MakeInternalSlots<TSlots extends RawSlots> = {
    [K in keyof TSlots]: Slot<TSlots[K]>
}

export type MakeSlots<TSlots extends RawSlots> = {
    [K in keyof TSlots]: VueSlot<TSlots[K]>
}

export type SlotsToProps<TSlots extends RawSlots> = {
    $children?:
        | VNodeChild
        | { [K in keyof MakeInternalSlots<TSlots>]?: MakeInternalSlots<TSlots>[K] }
        | { $stable?: boolean }

    'v-slots'?: {
        [K in keyof MakeInternalSlots<TSlots>]?: MakeInternalSlots<TSlots>[K] | false
    }
} & {
    [K in keyof MakeInternalSlots<TSlots> as `v-slot:${K & string}`]?:
    | MakeInternalSlots<TSlots>[K]
    | false
}

export type GenericProps<
    TProps,
    TSlots extends RawSlots,
> = {
    $props: TProps & SlotsToProps<TSlots>
    $slots: MakeSlots<TSlots>
}

// Maps slot types for Vue template/Volar: never (no-args slot) → {} (empty props object)
// Volar doesn't recognize zero-arg slot functions () => VNode[], but does recognize {} (no props)
type MakeVolarSlots<TSlots extends RawSlots> = {
    [K in keyof TSlots]: [TSlots[K]] extends [never] ? {} : TSlots[K]
}

type AnyGenericComponent = new (...args: any[]) => {
    $props?: any
    $slots?: any
}

type ConstructorSlots<T> =
    T extends new (
            props: any,
            slots: infer TSlots,
            ...args: any[]
        ) => any
        ? TSlots extends RawSlots
            ? TSlots
            : {}
        : {}

type DefineComponentWithSlots<TSlots extends RawSlots> = <
    PropsOptions extends Readonly<ComponentObjectPropsOptions>,
    RawBindings,
    D,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    S extends SlotsType = SlotsType<MakeVolarSlots<TSlots>>,
>(
    options: ComponentOptionsWithObjectProps<
        PropsOptions,
        RawBindings,
        D,
        C,
        M,
        {},
        {},
        {},
        string,
        {},
        string,
        S
    >,
) => DefineComponent<
    ExtractPropTypes<PropsOptions> & SlotsToProps<TSlots>,
    RawBindings,
    D,
    C,
    M,
    {},
    {},
    {},
    string,
    ComponentVueProps,
    ExtractPropTypes<PropsOptions> & SlotsToProps<TSlots>,
    ExtractDefaultPropTypes<PropsOptions>,
    SlotsType<MakeVolarSlots<TSlots>>
>

type DefineComponentWithGenericProps<
    TGeneric extends AnyGenericComponent,
    TExtraProps extends Record<string, unknown> = {},
> = <
    PropsOptions extends Readonly<ComponentObjectPropsOptions>,
    RawBindings,
    D,
    C extends ComputedOptions = {},
    M extends MethodOptions = {},
    Slots extends RawSlots = ConstructorSlots<TGeneric>,
    S extends SlotsType = SlotsType<MakeVolarSlots<Slots>>,
>(
    options: ComponentOptionsWithObjectProps<
        PropsOptions,
        RawBindings,
        D,
        C,
        M,
        {},
        {},
        {},
        string,
        {},
        string,
        S
    >,
) => DefineComponent<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    {},
    {},
    {},
    string,
    ComponentVueProps,
    ExtractPropTypes<PropsOptions> & TExtraProps,
    ExtractDefaultPropTypes<PropsOptions>,
    SlotsType<Partial<MakeSlots<Slots>>>
> & TGeneric

export function genericComponent(): DefineComponentWithSlots<{ default: never }>

export function genericComponent<
    T extends AnyGenericComponent,
    TExtraProps extends Record<string, unknown> = {},
>(): DefineComponentWithGenericProps<T, TExtraProps>

export function genericComponent<
    T extends RawSlots,
>(): DefineComponentWithSlots<T>

export function genericComponent() {
    return _defineComponent as any
}
