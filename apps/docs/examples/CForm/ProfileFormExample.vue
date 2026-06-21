<script setup lang="ts">
    import { ref } from 'vue'

    const formRef = ref()
    const saving = ref(false)
    const saved = ref(false)

    const form = ref({
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@example.com',
        phone: '',
        website: '',
        username: 'alexjohnson',
    })
    const original = { ...form.value }

    const requiredRule = [(v: string) => ({ valid: !!v?.trim(), message: 'Required' })]
    const emailRules = [
        (v: string) => ({ valid: !!v, message: 'Email is required' }),
        (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
    ]
    const phoneRules = [
        (v: string) => ({ valid: !v || /^\+?[\d\s\-()]{7,}$/.test(v), message: 'Invalid phone number' }),
    ]

    async function handleSave(validate: () => Promise<boolean>) {
        saved.value = false
        saving.value = true
        const valid = await validate()
        if (valid) {
            await new Promise((r) => setTimeout(r, 700))
            saved.value = true
        }
        saving.value = false
    }
    function handleReset() {
        form.value = { ...original }
        saved.value = false
        formRef.value?.reset?.()
    }
</script>

<template>
    <div class="d-flex justify-center pa-6">
        <c-card class="elevation-2 form-card">
            <div class="form-header d-flex align-center gap-3 px-6 py-5">
                <div class="header-icon d-flex align-center justify-center">
                    <c-icon
                        name="fas:user"
                        :size="18"
                        source="fa"
                    />
                </div>
                <div>
                    <div class="fs-lg fw-bold">
                        Edit Profile
                    </div>
                    <div
                        class="fs-sm"
                        style="opacity:.5"
                    >
                        Update your information
                    </div>
                </div>
            </div>

            <c-card-body class="px-6 pb-6 pt-5">
                <c-form ref="formRef">
                    <template #default="{ validate }">
                        <div class="d-flex flex-col gap-4">
                            <div class="form-row gap-4">
                                <c-text-field
                                    v-model="form.firstName"
                                    label="First name"
                                    :rules="requiredRule"
                                    validate-on="blur"
                                    preset="input.blue"
                                />
                                <c-text-field
                                    v-model="form.lastName"
                                    label="Last name"
                                    :rules="requiredRule"
                                    validate-on="blur"
                                    preset="input.blue"
                                />
                            </div>

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
                                v-model="form.phone"
                                label="Phone"
                                type="tel"
                                :rules="phoneRules"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:phone"
                                        :size="14"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>

                            <c-text-field
                                v-model="form.website"
                                label="Website"
                                validate-on="blur"
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:globe"
                                        :size="14"
                                        source="fa"
                                    />
                                </template>
                            </c-text-field>

                            <c-text-field
                                v-model="form.username"
                                label="Username"
                                readonly
                                preset="input.blue"
                            >
                                <template #prepend>
                                    <c-icon
                                        name="fas:at"
                                        :size="14"
                                        source="fa"
                                    />
                                </template>
                                <template #details>
                                    <span
                                        class="fs-xs"
                                        style="opacity:.5"
                                    >Username cannot be changed</span>
                                </template>
                            </c-text-field>

                            <div class="d-flex align-center gap-3 mt-2">
                                <c-btn
                                    class="btn-primary"
                                    :disabled="saving"
                                    @click="() => handleSave(validate)"
                                >
                                    {{ saving ? 'Saving…' : 'Save changes' }}
                                </c-btn>
                                <c-btn
                                    class="btn-ghost"
                                    @click="handleReset"
                                >
                                    Cancel
                                </c-btn>
                            </div>

                            <div
                                v-if="saved"
                                class="d-flex align-center gap-2 text-green fw-semi-bold fs-sm"
                            >
                                <c-icon
                                    name="fas:check"
                                    :size="13"
                                    source="fa"
                                />
                                Profile updated successfully
                            </div>
                        </div>
                    </template>
                </c-form>
            </c-card-body>
        </c-card>
    </div>
</template>

<style scoped>
.form-card { max-width: 480px; width: 100%; }

.form-header { border-bottom: 1px solid var(--vp-c-divider, #e5e5e5); }

.header-icon {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #27d98c, #2f8cff);
  color: #fff;
  flex-shrink: 0;
  line-height: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

@media (max-width: 480px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>
