import { defineRule } from './core'
import {
    isColorValue,
    isMarginValue,
    isOpacityValue,
    isPaddingValue,
    isPositionValue,
    isRadiusValue,
    isSizeValue,
    isZIndexValue,
} from './validators'

export const defaultRules = [
    defineRule({
        name: 'width',
        matcher: /^w-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({width: value,}),
    }),

    defineRule({
        name: 'height',
        matcher: /^h-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({height: value,}),
    }),

    defineRule({
        name: 'min-width',
        matcher: /^min-w-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({minWidth: value,}),
    }),

    defineRule({
        name: 'max-width',
        matcher: /^max-w-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({maxWidth: value,}),
    }),

    defineRule({
        name: 'min-height',
        matcher: /^min-h-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({minHeight: value,}),
    }),

    defineRule({
        name: 'max-height',
        matcher: /^max-h-\[(.+)\]$/,
        validate: isSizeValue,
        declaration: (value) => ({maxHeight: value,}),
    }),

    defineRule({
        name: 'z-index',
        matcher: /^z-\[(.+)\]$/,
        validate: isZIndexValue,
        declaration: (value) => ({zIndex: value,}),
    }),

    defineRule({
        name: 'margin',
        matcher: /^ma-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({margin: value,}),
    }),

    defineRule({
        name: 'margin-x',
        matcher: /^mx-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({
            marginLeft: value,
            marginRight: value,
        }),
    }),

    defineRule({
        name: 'margin-y',
        matcher: /^my-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({
            marginTop: value,
            marginBottom: value,
        }),
    }),

    defineRule({
        name: 'margin-bottom',
        matcher: /^mb-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({marginBottom: value,}),
    }),

    defineRule({
        name: 'margin-top',
        matcher: /^mt-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({marginTop: value,}),
    }),

    defineRule({
        name: 'margin-left',
        matcher: /^ml-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({marginLeft: value,}),
    }),

    defineRule({
        name: 'margin-right',
        matcher: /^mr-\[(.+)\]$/,
        validate: isMarginValue,
        declaration: (value) => ({marginRight: value,}),
    }),

    defineRule({
        name: 'padding',
        matcher: /^pa-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({padding: value,}),
    }),

    defineRule({
        name: 'padding-x',
        matcher: /^px-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({
            paddingLeft: value,
            paddingRight: value,
        }),
    }),

    defineRule({
        name: 'padding-y',
        matcher: /^py-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({
            paddingTop: value,
            paddingBottom: value,
        }),
    }),

    defineRule({
        name: 'padding-bottom',
        matcher: /^pb-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({paddingBottom: value,}),
    }),

    defineRule({
        name: 'padding-top',
        matcher: /^pt-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({paddingTop: value,}),
    }),

    defineRule({
        name: 'padding-left',
        matcher: /^pl-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({paddingLeft: value,}),
    }),

    defineRule({
        name: 'padding-right',
        matcher: /^pr-\[(.+)\]$/,
        validate: isPaddingValue,
        declaration: (value) => ({paddingRight: value,}),
    }),

    defineRule({
        name: 'left',
        matcher: /^left-\[(.+)\]$/,
        validate: isPositionValue,
        declaration: (value) => ({left: value,}),
    }),

    defineRule({
        name: 'right',
        matcher: /^right-\[(.+)\]$/,
        validate: isPositionValue,
        declaration: (value) => ({right: value,}),
    }),

    defineRule({
        name: 'top',
        matcher: /^top-\[(.+)\]$/,
        validate: isPositionValue,
        declaration: (value) => ({top: value,}),
    }),

    defineRule({
        name: 'bottom',
        matcher: /^bottom-\[(.+)\]$/,
        validate: isPositionValue,
        declaration: (value) => ({bottom: value,}),
    }),

    defineRule({
        name: 'inset',
        matcher: /^inset-\[(.+)\]$/,
        validate: isPositionValue,
        declaration: (value) => ({inset: value,}),
    }),

    defineRule({
        name: 'radius',
        matcher: /^radius-\[(.+)\]$/,
        validate: isRadiusValue,
        declaration: (value) => ({borderRadius: value,}),
    }),

    defineRule({
        name: 'radius-top-left',
        matcher: /^radius-tl-\[(.+)\]$/,
        validate: isRadiusValue,
        declaration: (value) => ({borderTopLeftRadius: value,}),
    }),

    defineRule({
        name: 'radius-top-right',
        matcher: /^radius-tr-\[(.+)\]$/,
        validate: isRadiusValue,
        declaration: (value) => ({borderTopRightRadius: value,}),
    }),

    defineRule({
        name: 'radius-bottom-left',
        matcher: /^radius-bl-\[(.+)\]$/,
        validate: isRadiusValue,
        declaration: (value) => ({borderBottomLeftRadius: value,}),
    }),

    defineRule({
        name: 'radius-bottom-right',
        matcher: /^radius-br-\[(.+)\]$/,
        validate: isRadiusValue,
        declaration: (value) => ({borderBottomRightRadius: value,}),
    }),

    defineRule({
        name: 'opacity',
        matcher: /^opacity-\[(.+)\]$/,
        validate: isOpacityValue,
        declaration: (value) => ({opacity: value,}),
    }),

    defineRule({
        name: 'color',
        matcher: /^color-\[(.+)\]$/,
        validate: isColorValue,
        declaration: (value) => ({color: value,}),
    }),

    defineRule({
        name: 'background-color',
        matcher: /^bg-\[(.+)\]$/,
        validate: isColorValue,
        declaration: (value) => ({backgroundColor: value,}),
    }),
]
