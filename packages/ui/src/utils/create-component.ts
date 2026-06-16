import {
    type AllowedComponentProps,
    type ComponentCustomProps,
    type ComponentObjectPropsOptions,
    type DefineComponent,
    defineComponent as _defineComponent,
    type ExtractDefaultPropTypes,
    type SetupContext,
    type SlotsType,
    type VNode,
    type VNodeChild,
    type VNodeProps,
} from 'vue'

import type { InferFactoryProps } from './props-factory'

export type RawSlots = Record<string, unknown>

export type Slot<T = undefined> =
    [T] extends [undefined]
        ? () => VNodeChild
        : (arg: T) => VNodeChild

export type VueSlot<T = undefined> =
    [T] extends [undefined]
        ? () => VNode[]
        : (arg: T) => VNode[]

export type MakeInternalSlots<TSlots extends RawSlots> = {
    [K in keyof TSlots]: Slot<TSlots[K]>
}

export type MakeSlots<TSlots extends RawSlots> = {
    [K in keyof TSlots]: VueSlot<TSlots[K]>
}

export type SlotsToProps<
    TSlots extends RawSlots,
    TInternalSlots = MakeInternalSlots<TSlots>,
> = {
    $children?:
        | VNodeChild
        | (TInternalSlots extends { default: infer V } ? V : {})
        | { [K in keyof TInternalSlots]?: TInternalSlots[K] }
        | { $stable?: boolean }

    'v-slots'?: {
        [K in keyof TInternalSlots]?: TInternalSlots[K] | false
    }
} & {
    [K in keyof TInternalSlots as `v-slot:${K & string}`]?:
    | TInternalSlots[K]
    | false
}

export type GenericProps<
    TProps,
    TSlots extends RawSlots,
> = {
    $props: TProps & SlotsToProps<TSlots>
    $slots: MakeSlots<TSlots>
}

export type PublicVueProps =
    VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps

type ComponentOptions<
    TSlots extends RawSlots,
    TRuntimeProps extends ComponentObjectPropsOptions,
> = {
    name?: string
    props?: TRuntimeProps
    emits?: any
    inheritAttrs?: boolean

    setup?: (
        props: InferFactoryProps<TRuntimeProps>,
        ctx: Omit<SetupContext<any>, 'slots'> & {
            slots: MakeSlots<TSlots>
        },
    ) => void | (() => VNodeChild)
}

type DefineComponentWithSlots<TSlots extends RawSlots> = <
    TRuntimeProps extends ComponentObjectPropsOptions,
>(
    options: ComponentOptions<TSlots, TRuntimeProps>,
) => DefineComponent<
    InferFactoryProps<TRuntimeProps>,
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    string,
    PublicVueProps,
    InferFactoryProps<TRuntimeProps> & SlotsToProps<TSlots>,
    ExtractDefaultPropTypes<TRuntimeProps>,
    SlotsType<Partial<MakeSlots<TSlots>>>
>

type GenericComponentConstructor = new (
    props: any,
    slots: any,
) => {
    $props?: any
    $slots?: any
}

type ConstructorProps<T extends GenericComponentConstructor> =
    T extends new (props: infer P, slots: any) => any
        ? P
        : {}

type ConstructorSlots<T extends GenericComponentConstructor> =
    T extends new (props: any, slots: infer S) => any
        ? S extends RawSlots
            ? S
            : {}
        : {}

type DefineGenericComponent<
    TGeneric extends GenericComponentConstructor,
> = <
    TRuntimeProps extends ComponentObjectPropsOptions,
>(
    options: ComponentOptions<
        ConstructorSlots<TGeneric>,
        TRuntimeProps
    >,
) => TGeneric & DefineComponent<
    InferFactoryProps<TRuntimeProps>,
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    string,
    PublicVueProps,
    InferFactoryProps<TRuntimeProps>
    & SlotsToProps<ConstructorSlots<TGeneric>>,
    ExtractDefaultPropTypes<TRuntimeProps>,
    SlotsType<Partial<MakeSlots<ConstructorSlots<TGeneric>>>>
>

export function genericComponent<
    TGeneric extends GenericComponentConstructor,
>(): DefineGenericComponent<TGeneric>

export function genericComponent<
    TSlots extends RawSlots,
>(): DefineComponentWithSlots<TSlots>

export function genericComponent(): DefineComponentWithSlots<{ default: undefined }>

export function genericComponent() {
    return _defineComponent as any
}
