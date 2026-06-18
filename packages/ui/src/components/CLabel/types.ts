import type { AllowedComponentProps, VNodeProps } from 'vue'

export type CLabelProps = AllowedComponentProps & VNodeProps & {
    tag?: string
    id?: string
    for?: string
}
