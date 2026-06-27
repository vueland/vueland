<script setup lang="ts">
    import { ref } from 'vue'

    const search = ref('')
    const username = ref('')
    const github = ref('')
    const amount = ref('')
    const nickname = ref('')
    const promo = ref('SAVE20')

    const nicknameRules = [
        (v: string) => ({ valid: v.length <= 20, message: 'Max 20 characters' }),
    ]
</script>

<template>
    <div class="ex-grid">
        <!-- Prepend icon -->
        <c-text-field
            v-model="search"
            label="Search"
            clearable
            preset="input.blue"
        >
            <template #prepend>
                <c-icon
                    name="fas:search"
                    :size="16"
                    source="fa"
                />
            </template>
        </c-text-field>

        <!-- Prepend text prefix -->
        <c-text-field
            v-model="username"
            label="Username"
            preset="input.deepPurple"
        >
            <template #prepend>
                <span class="prefix">@</span>
            </template>
        </c-text-field>

        <!-- Append icon -->
        <c-text-field
            v-model="github"
            label="GitHub profile"
        >
            <template #append>
                <c-icon
                    name="fab:github"
                    :size="18"
                    source="fa"
                />
            </template>
        </c-text-field>

        <!-- Append text suffix -->
        <c-text-field
            v-model="amount"
            label="Amount"
            type="number"
            preset="input.green"
        >
            <template #append>
                <span class="suffix">USD</span>
            </template>
        </c-text-field>

        <!-- Custom details slot -->
        <c-text-field
            v-model="nickname"
            label="Nickname"
            :rules="nicknameRules"
            validate-on="input"
            preset="input.orange"
        >
            <template #prepend>
                <c-icon
                    name="fas:hashtag"
                    :size="16"
                    source="fa"
                />
            </template>
            <template #details="{ errorMessage, hasError }">
                <span :style="{ color: hasError ? 'var(--c-sys-color-error)' : 'inherit' }">
                    {{ errorMessage || `${nickname.length}/20 characters` }}
                </span>
            </template>
        </c-text-field>

        <!-- Prepend + Append -->
        <c-text-field
            v-model="promo"
            label="Promo code"
            preset="input.pink"
        >
            <template #prepend>
                <c-icon
                    name="fas:percent"
                    :size="16"
                    source="fa"
                />
            </template>
            <template #append>
                <c-icon
                    name="fas:check"
                    :size="16"
                    source="fa"
                    style="color:var(--c-sys-color-success, #4caf50)"
                />
            </template>
        </c-text-field>
    </div>
</template>

<style scoped>
.ex-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px;
}
@media (max-width: 600px) {
  .ex-grid { grid-template-columns: 1fr; }
}
.prefix, .suffix {
  font-size: 13px;
  opacity: .6;
  padding: 0 4px;
}
</style>
