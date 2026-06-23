<script setup lang="ts">
    import { ref } from 'vue'

    const name = ref('')

    const email = ref('')

    const city = ref('Баку')

    const login = ref('admin')

    const blocked = ref('—')

    const altName = ref('')

    const value = ref([])

    const takenEmails = [
        'test@taken.com',
        'admin@example.com',
        'aaa@example.com',
        'sss@example.com',
        'ddd@example.com',
    ]

    const emailRules = [
        (v: string) => ({ valid: !!v, message: 'Обязательное поле' }),
        (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email format' }),
        async (v: string) => {
            await new Promise(r => setTimeout(r, 2000))
            return { valid: !takenEmails.includes(v.toLowerCase()), message: 'This email is already registered' }
        },
    ]
</script>

<template>
    <c-card
        class="pa-6"
        style="max-width: 820px; margin: 32px auto"
    >
        <c-card-header>
            <h2 class="ma-0">
                Форма с пресетами состояний
            </h2>
            <p class="text-secondary ma-0 mt-2">
                Поля используют пресеты <b>input.soft</b> и <b>input.outline</b>.
                Каждое состояние (focused / filled / error / disabled / readonly) —
                отдельный плоский пресет, целиком подменяющий зоны base.
            </p>
        </c-card-header>

        <c-card-body class="pt-4">
            <c-chip
                v-for="it in 3"
                :key="it"
                closable
                class="mr-2 mb-2 elevation-2"
            >
                some {{ it }}
            </c-chip>
            <c-form v-slot="{ validate, reset }">
                <c-row>
                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="name"
                            label="Имя"
                            preset="input.soft"
                            details="Сфокусируйся — лейбл станет синим"
                        />
                    </c-col>

                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="email"
                            label="Email"
                            preset="input.soft"
                            :rules="emailRules"
                            details="Проверь пустым — станет красным"
                        >
                            <template #details="{ errorMessage, hasError, validating }">
                                <span
                                    v-if="validating"
                                    style="color:var(--c-app-primary-color)"
                                >
                                    Verifying email…
                                </span>
                                <span
                                    v-else-if="hasError"
                                    style="color:var(--c-app-error-color)"
                                >
                                    {{ errorMessage }}
                                </span>
                                <span
                                    v-else
                                    style="opacity:.6"
                                >We'll send a verification link</span>
                            </template>
                        </c-text-field>
                    </c-col>

                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="city"
                            label="Город (filled)"
                            preset="input.soft"
                            details="Есть значение → зелёный filled"
                        />
                    </c-col>

                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="login"
                            label="Логин (readonly)"
                            preset="input.soft"
                            readonly
                        />
                    </c-col>

                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="blocked"
                            label="Заблокировано (disabled)"
                            preset="input.soft"
                            disabled
                        />
                    </c-col>

                    <c-col
                        cols="12"
                        md="6"
                    >
                        <c-text-field
                            v-model="altName"
                            label="Другой пресет (outline)"
                            preset="input.outline"
                            details="Тот же компонент — индиго-палитра"
                        />
                    </c-col>
                    <c-col
                        xl="6"
                        lg="6"
                        md="12"
                    >
                        <c-autocomplete
                            v-model="value"
                            label="Check value"
                            :items="takenEmails"
                            multiple
                            clearable
                        />
                    </c-col>
                </c-row>

                <c-row
                    class="mt-4"
                    justify="end"
                >
                    <c-btn
                        class="bg-grey-lighten-1 text-white mr-2"
                        @click="reset"
                    >
                        Сбросить
                    </c-btn>
                    <c-btn
                        class="bg-primary text-white elevation-2"
                        @click="validate"
                    >
                        Проверить
                    </c-btn>
                </c-row>
            </c-form>
        </c-card-body>
    </c-card>
</template>
