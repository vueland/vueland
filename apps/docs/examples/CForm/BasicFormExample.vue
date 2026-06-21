<script setup lang="ts">
    import { ref } from 'vue'

    const formRef = ref()
    const success = ref(false)
    const showPwd = ref(false)
    const form = ref({ email: '', password: '' })

    const emailRules = [
        (v: string) => ({ valid: !!v, message: 'Email is required' }),
        (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email address' }),
    ]
    const passwordRules = [
        (v: string) => ({ valid: !!v, message: 'Password is required' }),
        (v: string) => ({ valid: v.length >= 6, message: 'Minimum 6 characters' }),
    ]

    async function handleSubmit(validate: () => Promise<boolean>) {
        if (await validate()) success.value = true
    }
    function handleReset() {
        form.value = { email: '', password: '' }
        success.value = false
        formRef.value?.reset?.()
    }
</script>

<template>
    <div class="d-flex justify-center pa-6">
        <c-card class="elevation-2 form-card">
            <div class="form-header d-flex align-center gap-3 px-6 py-5">
                <div class="header-icon d-flex align-center justify-center">
                    <c-icon
                        name="fas:lock"
                        :size="18"
                        source="fa"
                    />
                </div>
                <div>
                    <div class="fs-lg fw-bold">
                        Sign In
                    </div>
                    <div
                        class="fs-sm"
                        style="opacity:.5"
                    >
                        Welcome back
                    </div>
                </div>
            </div>

            <c-card-body class="px-6 pb-6 pt-5">
                <c-form
                    ref="formRef"
                    @submit.prevent
                >
                    <template #default="{ validate }">
                        <div class="d-flex flex-col gap-4">
                            <c-text-field
                                v-model="form.email"
                                label="Email"
                                type="email"
                                :rules="emailRules"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:envelope"
                                        :size="14"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>

                            <c-text-field
                                v-model="form.password"
                                :type="showPwd ? 'text' : 'password'"
                                label="Password"
                                :rules="passwordRules"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:lock"
                                        :size="14"
                                        source="fa"
                                    />
                                </template>
                                <template #append>
                                    <c-icon
                                        :name="showPwd ? 'fas:eye-slash' : 'fas:eye'"
                                        :size="14"
                                        source="fa"
                                        class="cursor-pointer"
                                        @click="showPwd = !showPwd"
                                    />
                                </template>
                            </c-text-field>

                            <div class="d-flex align-center gap-3 mt-2">
                                <c-btn
                                    class="btn-primary"
                                    @click="() => handleSubmit(validate)"
                                >
                                    Sign in
                                </c-btn>
                                <c-btn
                                    class="btn-ghost"
                                    @click="handleReset"
                                >
                                    Reset
                                </c-btn>
                            </div>

                            <div
                                v-if="success"
                                class="d-flex align-center gap-2 text-green fw-semi-bold fs-sm"
                            >
                                <c-icon
                                    name="fas:check"
                                    :size="13"
                                    source="fa"
                                />
                                Logged in as {{ form.email }}
                            </div>
                        </div>
                    </template>
                </c-form>
            </c-card-body>
        </c-card>
    </div>
</template>

<style scoped>
.form-card { max-width: 400px; width: 100%; }

.form-header { border-bottom: 1px solid var(--vp-c-divider, #e5e5e5); }

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff;
  flex-shrink: 0;
  line-height: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff !important;
  font-weight: 600;
  padding: 0 24px;
}

.btn-ghost {
  background: transparent !important;
  border: 1.5px solid var(--vp-c-divider, #ddd) !important;
  color: var(--vp-c-text-2) !important;
}
</style>
