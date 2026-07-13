<script setup lang="ts">
    import { ref } from 'vue'

    const name = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const location = ref('')
    const amount = ref('')
    const showPwd = ref(false)
</script>

<template>
    <div class="text-field-demo d-flex flex-wrap gap-4">
        <div class="text-field-demo__item">
            <c-text-field
                v-model="name"
                label="Full name"
                clearable
            >
                <template #prepend>
                    <c-icon
                        name="fas:user"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </div>
        <div class="text-field-demo__item">
            <c-text-field
                v-model="email"
                label="Email"
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

        <div class="text-field-demo__item">
            <c-text-field
                v-model="password"
                :type="showPwd ? 'text' : 'password'"
                label="Password"
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

        <div class="text-field-demo__item">
            <c-text-field
                v-model="phone"
                label="Phone"
                preset="input.teal"
            >
                <template #prepend>
                    <c-icon
                        name="fas:phone"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </div>

        <div class="text-field-demo__item">
            <c-text-field
                v-model="location"
                label="Location"
                preset="input.orange"
            >
                <template #prepend>
                    <c-icon
                        name="fas:map-marker-alt"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </div>

        <div class="text-field-demo__item">
            <c-text-field
                v-model="amount"
                label="Amount"
                type="number"
                preset="input.green"
            >
                <template #prepend>
                    <c-icon
                        name="fas:dollar-sign"
                        :size="16"
                        source="fa"
                    />
                </template>
            </c-text-field>
        </div>
    </div>
</template>

<style scoped>
.text-field-demo__item {
  flex: 1 1 280px;
  min-width: min(100%, 260px);
}
</style>
