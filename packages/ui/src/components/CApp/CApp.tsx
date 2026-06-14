import { defineComponent, provide, unref } from 'vue'

import { useAppScroll } from '../../composables'
import { $APP_API_KEY } from '../../constants'

export const CApp = defineComponent({
    name: 'CApp',
    setup(_, { slots }) {
        const {
            appRef,
            classes,
            getScrollTop,
            getScrollLeft,
            blockScroll,
            unblockScroll
        } = useAppScroll()

        provide($APP_API_KEY, {
            getScrollTop,
            getScrollLeft,
            blockScroll,
            unblockScroll,
        })

        return () => (
            <div ref={appRef} class={['c-app', unref(classes)]}>
                <div class="c-app__wrapper">
                    {slots.default?.()}
                </div>
            </div>
        )
    }
})
