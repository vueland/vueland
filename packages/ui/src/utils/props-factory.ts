import type {
    ComponentObjectPropsOptions,
    Prop,
    PropType,
} from 'vue'

type AnyConstructor =
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
                            T extends FunctionConstructor ? (...args: any[]) => any :
                                T extends SymbolConstructor ? symbol :
                                    unknown

type PropTypeValue<T> =
    T extends PropType<infer V>
        ? V
        : T extends readonly unknown[]
            ? ConstructorValue<T[number]>
            : T extends AnyConstructor
                ? ConstructorValue<T>
                : unknown

type PropOptionValue<T> =
    T extends Prop<infer V>
        ? V
        : T extends { type: infer Type }
            ? PropTypeValue<Type>
            : PropTypeValue<T>

type HasDefault<T> =
    'default' extends keyof T
        ? true
        : false

type IsRequired<T> =
    T extends { required: true }
        ? true
        : false

type RequiredPropKeys<TProps extends ComponentObjectPropsOptions> = {
    [K in keyof TProps]:
    IsRequired<TProps[K]> extends true
        ? K
        : HasDefault<TProps[K]> extends true
            ? K
            : never
}[keyof TProps]

type OptionalPropKeys<TProps extends ComponentObjectPropsOptions> =
    Exclude<keyof TProps, RequiredPropKeys<TProps>>

export type InferFactoryProps<
    TProps extends ComponentObjectPropsOptions,
> = {
    readonly [K in RequiredPropKeys<TProps>]: PropOptionValue<TProps[K]>
} & {
    readonly [K in OptionalPropKeys<TProps>]?: PropOptionValue<TProps[K]>
}

type AppendDefault<
    TProps extends ComponentObjectPropsOptions,
    TDefaults,
> = {
    [K in keyof TProps]:
    K extends keyof TDefaults
        ? TProps[K] & { default: TDefaults[K] }
        : TProps[K]
}

export function propsFactory<
    TProps extends ComponentObjectPropsOptions,
>(props: TProps) {
    return <
        TDefaults extends Partial<Record<keyof TProps, unknown>> = {},
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
