import {
    defineComponent,
    type FunctionalComponent,
    h,
    type SetupContext,
} from 'vue'

export const createSimpleInstance = (c: string, el = 'div', name: string = '') => {
    const _name =
        name ||
        c
            .split('-')
            .map((it) => it[0].toUpperCase() + it.slice(1))
            .join('')
    return defineComponent({
        name: _name,
        setup(_, { slots }) {
            const propsData = { class: { [c.trim()]: true } }

            return () => h(el, propsData, slots.default && slots.default())
        },
    })
}

type AnyProps = Record<string, any>

export function createFunctionalComponent(cls: string, tag: string = 'div'): FunctionalComponent {
    const name = cls
        .split('-')
        .map((it) => it[0].toUpperCase() + it.slice(1))
        .join('')

    const Comp = (props: AnyProps, ctx: SetupContext) => {
        return h(
            props.tag ?? tag,
            {
                ...ctx.attrs,
                class: [cls],
            },
            ctx.slots.default?.(),
        )
    }

    Comp.displayName = name

    return Comp as FunctionalComponent
}
