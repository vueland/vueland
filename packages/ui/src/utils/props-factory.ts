import type {
    ComponentObjectPropsOptions,
    PropType,
} from 'vue'

type Constructor =
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor
    | FunctionConstructor
    | SymbolConstructor

type ConstructorValue<T> =
    T extends StringConstructor ? string :
        T extends NumberConstructor ? number :
            T extends BooleanConstructor ? boolean :
                T extends ArrayConstructor ? unknown[] :
                    T extends ObjectConstructor ? Record<string, unknown> :
                        T extends DateConstructor ? Date :
                            T extends FunctionConstructor ? (...args: unknown[]) => unknown :
                                T extends SymbolConstructor ? symbol :
                                    never

type PropConstructorValue<T> =
    T extends readonly unknown[]
        ? PropConstructorValue<T[number]>
        : T extends Constructor
            ? ConstructorValue<T>
            : T extends PropType<infer V>
                ? V
                : never

type PropOptionValue<T> =
    T extends { type: infer Type }
        ? PropConstructorValue<Type>
        : T extends PropType<infer V>
            ? V
            : T extends Constructor
                ? ConstructorValue<T>
                : T extends readonly unknown[]
                    ? PropConstructorValue<T[number]>
                    : unknown

type IsRequired<T> =
    T extends { required: true }
        ? true
        : false

type HasDefault<T> =
    T extends { default: unknown }
        ? true
        : false

type DefinedKeys<TProps> = {
    [K in keyof TProps]:
    IsRequired<TProps[K]> extends true
        ? K
        : HasDefault<TProps[K]> extends true
            ? K
            : never
}[keyof TProps]

type OptionalKeys<TProps> = {
    [K in keyof TProps]:
    K extends DefinedKeys<TProps>
        ? never
        : K
}[keyof TProps]

export type InferFactoryProps<TProps> = {
    [K in DefinedKeys<TProps>]: PropOptionValue<TProps[K]>
} & {
    [K in OptionalKeys<TProps>]?: PropOptionValue<TProps[K]>
}

type DefaultValue<T> =
    T extends (...args: any[]) => any
        ? T
        : T | (() => T)

type Defaults<TProps> = Partial<{
    [K in keyof TProps]: DefaultValue<PropOptionValue<TProps[K]>>
}>

type NormalizeProp<T> =
    T extends object
        ? T
        : { type: T }

type AppendDefault<
    TProps,
    TDefaults extends Partial<Record<keyof TProps, unknown>>,
> = {
    [K in keyof TProps]:
    K extends keyof TDefaults
        ? NormalizeProp<TProps[K]> & { default: TDefaults[K] }
        : TProps[K]
}

export function propsFactory<
    TProps extends ComponentObjectPropsOptions,
>(props: TProps) {
    return <
        TDefaults extends Defaults<TProps> = {},
    >(defaults?: TDefaults): AppendDefault<TProps, TDefaults> => {
        return Object.keys(props).reduce<Record<string, unknown>>((result, key) => {
            const prop = props[key]

            const isObjectDefinition =
                typeof prop === 'object'
                && prop !== null
                && !Array.isArray(prop)

            const definition = isObjectDefinition
                ? prop
                : { type: prop }

            result[key] =
                defaults && key in defaults
                    ? {
                        ...definition,
                        default: defaults[key as keyof TDefaults],
                    }
                    : definition

            return result
        }, {}) as AppendDefault<TProps, TDefaults>
    }
}
