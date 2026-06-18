import {
    type Component,
    computed,
    defineComponent,
    type PropType,
    unref,
} from 'vue'

import { type IconMode, useIcon } from '../../composables'
import { convertToUnit } from '../../utils'

export const CIcon = defineComponent({
    name: 'CIcon',
    inheritAttrs: false,
    props: {
        name: [String, Number] as PropType<string | number>,
        source: String as PropType<IconMode>,
        component: Object as PropType<Component | null>,
        body: String,
        viewBox: String,
        size: [String, Number] as PropType<string | number>,
        width: [String, Number] as PropType<string | number>,
        height: [String, Number] as PropType<string | number>,
        tag: String,
        spritePrefix: String,
        spritePath: String,
    },
    setup(props, { attrs }) {
        const resolvedIcon = useIcon(props)

        const rootStyle = computed(() => ({
            width: convertToUnit(unref(resolvedIcon).size ?? props.width ?? props.size ?? 16),
            height: convertToUnit(unref(resolvedIcon).size ?? props.height ?? props.size ?? 16),
        }))

        return () => {
            const icon = unref(resolvedIcon)
            const Tag = (props.tag ?? 'span') as any

            return (
                <Tag class={['c-icon', { 'c-icon--empty': !icon.found }]} style={unref(rootStyle)}>
                    {icon.found && icon.kind === 'component' && icon.component ? (
                        <component is={icon.component} class="c-icon__component" {...attrs} />
                    ) : icon.found ? (
                        <svg
                            class="c-icon__svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox={icon.viewBox}
                            fill="currentColor"
                            focusable="false"
                            {...attrs}
                        >
                            {icon.href ? <use href={icon.href} /> : <g innerHTML={icon.body} />}
                        </svg>
                    ) : null}
                </Tag>
            )
        }
    },
})

export type CIconProps = InstanceType<typeof CIcon>['$props']
