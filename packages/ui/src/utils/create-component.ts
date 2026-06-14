import {
    type AllowedComponentProps,
    type ComponentCustomProps,
    type ComponentObjectPropsOptions,
    type DefineComponent,
    defineComponent as _defineComponent,
    type ExtractDefaultPropTypes,
    type SetupContext,
    type VNode,
    type VNodeChild,
    type VNodeProps,
} from 'vue'

import type { InferFactoryProps } from './props-factory'

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

export type PublicVueProps =
    VNodeProps
    & AllowedComponentProps
    & ComponentCustomProps

export type ComponentPublicProps<
    TProps,
    TSlots extends RawSlots = { default: never },
> =
    TProps
    & PublicVueProps
    & SlotsToProps<TSlots>

export type GenericProps<
    TProps,
    TSlots extends RawSlots,
> = {
    $props: TProps & SlotsToProps<TSlots>
    $slots: MakeSlots<TSlots>
}

type SetupProps<
    TRuntimeProps extends ComponentObjectPropsOptions,
    TPublicProps,
> =
    unknown extends TPublicProps
        ? InferFactoryProps<TRuntimeProps>
        : TPublicProps

type ComponentOptions<
    TPublicProps,
    TSlots extends RawSlots,
    TRuntimeProps extends ComponentObjectPropsOptions,
> = {
    name?: string
    props?: TRuntimeProps
    emits?: any
    inheritAttrs?: boolean

    setup?: (
        props: SetupProps<TRuntimeProps, TPublicProps>,
        ctx: Omit<SetupContext<any>, 'slots'> & {
            slots: MakeSlots<TSlots>
        },
    ) => void | (() => VNodeChild)
}

type DefineComponentWithPublicProps<
    TPublicProps,
    TSlots extends RawSlots,
> = <
    TRuntimeProps extends ComponentObjectPropsOptions,
>(
    options: ComponentOptions<TPublicProps, TSlots, TRuntimeProps>,
) => DefineComponent<
    SetupProps<TRuntimeProps, TPublicProps>,
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    string,
    PublicVueProps,
    SetupProps<TRuntimeProps, TPublicProps> & SlotsToProps<TSlots>,
    ExtractDefaultPropTypes<TRuntimeProps>,
    MakeSlots<TSlots>
>

type GenericComponentConstructor = abstract new (...args: any[]) => {
    $props?: Record<string, any>
    $slots?: Record<string, any>
}

type ConstructorProps<T extends GenericComponentConstructor> =
    ConstructorParameters<T> extends [infer Props, ...any[]]
        ? Props
        : {}

type ConstructorSlots<T extends GenericComponentConstructor> =
    ConstructorParameters<T> extends [any, infer Slots, ...any[]]
        ? Slots extends RawSlots
            ? Slots
            : {}
        : {}

type DefineGenericComponent<
    TGeneric extends GenericComponentConstructor,
> = <
    TRuntimeProps extends ComponentObjectPropsOptions,
>(
    options: ComponentOptions<
        ConstructorProps<TGeneric>,
        ConstructorSlots<TGeneric>,
        TRuntimeProps
    >,
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
    InferFactoryProps<TRuntimeProps>
    & SlotsToProps<ConstructorSlots<TGeneric>>,
    ExtractDefaultPropTypes<TRuntimeProps>,
    MakeSlots<ConstructorSlots<TGeneric>>
> & TGeneric

export function createComponent<
    TPublicProps = unknown,
    TSlots extends RawSlots = { default: never },
>(): DefineComponentWithPublicProps<TPublicProps, TSlots> {
    return _defineComponent as any
}

export function genericComponent<
    TGeneric extends GenericComponentConstructor,
>(): DefineGenericComponent<TGeneric> {
    return createComponent() as any
}
