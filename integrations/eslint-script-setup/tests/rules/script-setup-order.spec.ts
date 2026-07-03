import * as tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { scriptSetupOrder } from '../../src/rules/script-setup-order'

const tester = new RuleTester({
    languageOptions: { ecmaVersion: 2020, sourceType: 'module', parser: tsParser },
})

describe('script-setup-order', () => {
    // ─── valid ────────────────────────────────────────────────────────────────

    it('valid: правильный порядок включая макросы', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: `
                        import { ref, computed } from 'vue'
                        const props = defineProps({ count: Number })
                        defineEmits(['update'])
                        const router = useRouter()
                        const count = ref(0)
                        const double = computed(() => count.value * 2)
                        function increment() { count.value++ }
                        watchEffect(() => {})
                        watch(count, () => {})
                        onMounted(() => {})
                    `.trim(),
                },
            ],
            invalid: [],
        })
    })

    it('valid: обычная переменная между reactive и computed', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\nconst label = \'hello\'\nconst double = computed(() => count.value * 2)',
                },
            ],
            invalid: [],
        })
    })

    it('valid: watchEffect перед watch — правильный порядок', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'watchEffect(() => {})\nwatch(count, () => {})',
                },
            ],
            invalid: [],
        })
    })

    it('valid: FunctionDeclaration после composable — hoistable, нет ошибки', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const router = useRouter()\nconst count = ref(0)\nfunction helper() { return 1 }',
                },
            ],
            invalid: [],
        })
    })

    it('valid: не .vue файл — правило игнорируется', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'utils.ts',
                    code: 'onMounted(() => {})\nconst count = ref(0)',
                },
            ],
            invalid: [],
        })
    })

    it('valid: withDefaults как макрос — правильная позиция', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const props = withDefaults(defineProps(), { size: \'md\' })\nconst router = useRouter()',
                },
            ],
            invalid: [],
        })
    })

    it('valid: defineExpose может ссылаться на локальные объявления', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const el = ref()\nfunction focus() {}\ndefineExpose({ el, focus })',
                },
            ],
            invalid: [],
        })
    })

    it('invalid: кастомный order ставит неперечисленные категории после указанных', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ order: ['import', 'reactive', 'computed', 'watch', 'lifecycle'] }],
                    code: 'const count = ref(0)\nwatch(count, () => {})\nwatchEffect(() => {})\nonMounted(() => {})',
                    output: 'const count = ref(0)\nwatch(count, () => {})\n\nonMounted(() => {})\n\nwatchEffect(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: частичный order закрепляет macros выше composable', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ order: ['import', 'type', 'macros'] }],
                    code: 'const router = useRouter()\nconst slots = defineSlots()',
                    output: 'const slots = defineSlots()\n\nconst router = useRouter()',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('valid: unknown-ноды не участвуют в кастомном order', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    options: [{ order: ['import', 'type', 'macros'] }],
                    code: 'defineExpose({ focus })\nconst model = defineModel()',
                },
            ],
            invalid: [],
        })
    })

    // ─── invalid ──────────────────────────────────────────────────────────────

    it('invalid: макросы после композаблов — autofix переставляет', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const router = useRouter()\ndefineProps({ count: Number })',
                    output: 'defineProps({ count: Number })\n\nconst router = useRouter()',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: defineModel после reactive — autofix переставляет как макрос', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\nconst model = defineModel()',
                    output: 'const model = defineModel()\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: lifecycle перед composable — autofix переставляет', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nconst router = useRouter()',
                    output: 'const router = useRouter()\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: обычная переменная после computed — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const double = computed(() => 1)\nconst label = \'hello\'',
                    output: 'const label = \'hello\'\n\nconst double = computed(() => 1)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: watchEffect после lifecycle — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nwatchEffect(() => {})',
                    output: 'watchEffect(() => {})\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: watch после lifecycle — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nwatch(count, () => {})',
                    output: 'watch(count, () => {})\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: type после reactive — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\ntype Status = \'idle\' | \'done\'',
                    output: 'type Status = \'idle\' | \'done\'\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: FunctionDeclaration hoistable — sortируется без depConflict', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'function helper() { return 1 }\nconst count = ref(helper())',
                    output: 'const count = ref(helper())\n\nfunction helper() { return 1 }',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: ссылки в теле FunctionDeclaration ленивые — сортирует без depConflict', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    // частичный order: function и reactive не перечислены и сохраняют
                    // свой порядок — onBlur остаётся выше menu, и это валидно,
                    // потому что тело функции выполняется только при вызове
                    options: [{ order: ['import', 'type', 'macros'] }],
                    code: 'function onBlur() { menu.value = false }\nconst model = defineModel()\nconst menu = shallowRef(false)',
                    output: 'const model = defineModel()\n\nfunction onBlur() { menu.value = false }\n\nconst menu = shallowRef(false)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: computed зависит от другого computed — depConflict без фикса', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    // double зависит от count, после сортировки computed оба окажутся в одной
                    // категории и сохранят порядок — но reactive после function нарушение
                    // label (variable) зависит от double (computed) — после сортировки variable
                    // идёт ДО computed → depConflict
                    code: 'const double = computed(() => 1)\nconst label = double.value + \'!\'',
                    errors: [{ messageId: 'depConflict' }],
                },
            ],
        })
    })

    it('invalid: зависимость через TSAsExpression видна — depConflict вместо ломаного фикса', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const double = computed(() => 1)\nconst label = (double as any).value',
                    errors: [{ messageId: 'depConflict' }],
                },
            ],
        })
    })

    it('invalid: имена из деструктуринга видны — depConflict вместо ломаного фикса', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    // после сортировки reactive поднимется выше variable,
                    // но count зависит от имени "a" из деструктуринга
                    code: 'const { a } = obj\nconst count = ref(a)',
                    errors: [{ messageId: 'depConflict' }],
                },
            ],
        })
    })

    it('invalid: property в obj.prop не считается зависимостью — фикс применяется', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    // "flag" в state.flag — property, а не ссылка на computed flag
                    code: 'const flag = computed(() => 1)\nconst count = ref(state.flag)',
                    output: 'const count = ref(state.flag)\n\nconst flag = computed(() => 1)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: autofix сохраняет отступ ноды после комментария', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: '    onMounted(() => {})\n    // счётчик\n    const count = ref(0)',
                    output: '    // счётчик\n    const count = ref(0)\n\n    onMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: arrow composable конвертируется в function declaration', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: [
                        'const useCounter = () => { return { value: ref(0) } }',
                        'const count = ref(0)',
                        'const counter = useCounter()',
                    ].join('\n'),
                    output: [
                        'const counter = useCounter()',
                        '',
                        'const count = ref(0)',
                        '',
                        'function useCounter() { return { value: ref(0) } }',
                    ].join('\n'),
                    errors: [{ messageId: 'depConflictFixed' }],
                },
            ],
        })
    })

    it('invalid: autofix не добавляет пустые строки между соседними нодами', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nconst a = ref(0)\nconst b = ref(1)',
                    output: 'const a = ref(0)\nconst b = ref(1)\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: autofix сохраняет намеренные пустые строки между соседними нодами', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nconst a = ref(0)\n\nconst b = ref(1)',
                    output: 'const a = ref(0)\n\nconst b = ref(1)\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: кастомный composablePattern — своя функция как composable', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ composablePattern: '^inject[A-Z]' }],
                    code: 'const count = ref(0)\nconst injectTheme = injectTheme()',
                    output: 'const injectTheme = injectTheme()\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: кастомные reactiveApis — доп. API как reactive', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ reactiveApis: ['customRef'] }],
                    code: 'onMounted(() => {})\nconst x = customRef(() => ({ get() {}, set() {} }))',
                    output: 'const x = customRef(() => ({ get() {}, set() {} }))\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })
})
