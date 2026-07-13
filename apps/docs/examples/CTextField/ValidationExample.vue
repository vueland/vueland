<script setup lang="ts">
    import { ref } from 'vue'

    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const submitted = ref(false)
    const showPwd = ref(false)

    const emailRules = [
        (v: string) => ({ valid: !!v, message: 'Email is required' }),
        (v: string) => ({ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' }),
    ]
    const passwordRules = [
        (v: string) => ({ valid: !!v, message: 'Password is required' }),
        (v: string) => ({ valid: v.length >= 8, message: 'Minimum 8 characters' }),
        (v: string) => ({ valid: /[A-Z]/.test(v), message: 'At least one uppercase letter' }),
    ]

    function submit() { submitted.value = true }
    function reset() {
        email.value = ''
        password.value = ''
        phone.value = ''
        submitted.value = false
    }
</script>

<template>
    <div class="validation-demo d-flex flex-col gap-4">
        <div>
            <c-text-field
                v-model="email"
                label="Email"
                :rules="emailRules"
                validate-on="blur"
                details="We'll never share your email"
                preset="input.blue"
            >
                <template #prepend>
                    <c-icon
                        name="fas:envelope"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </div>

        <div>
            <c-text-field
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                label="Password"
                :rules="passwordRules"
                validate-on="blur"
                preset="input.deepPurple"
            >
                <template #prepend>
                    <c-icon
                        name="fas:lock"
                        :size="16"
                        source="fa"
                    />
                </template>
                <template #append>
                    <c-icon
                        :name="showPwd ? 'fas:eye-slash' : 'fas:eye'"
                        :size="16"
                        source="fa"
                        style="cursor:pointer"
                        @click="showPwd = !showPwd"
                    />
                </template>
            </c-text-field>
        </div>

        <div class="ex-actions">
            <c-btn
                class="bg-blue elevation-1"
                style="color:#fff"
                @click="submit"
            >
                Submit
            </c-btn>
            <c-btn
                variant="text"
                @click="reset"
            >
                Reset
            </c-btn>
        </div>
        <p
            v-if="submitted"
            class="ex-success"
        >
            ✓ Submitted successfully!
        </p>
    </div>
</template>

<style scoped>
.validation-demo {
  max-width: 420px;
  margin-inline: auto;
}

.ex-actions {
  display: flex;
  gap: 8px;
}

.ex-success {
  color: #4caf50;
  font-weight: 500;
  margin: 0;
}
</style>
