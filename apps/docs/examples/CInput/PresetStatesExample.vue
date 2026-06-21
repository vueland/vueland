<template>
  <div class="ex-wrap">
    <div class="states-grid">
      <div class="state-block">
        <div class="state-label">Default</div>
        <CTextField v-model="val" label="Label" preset="input.blue" />
      </div>
      <div class="state-block">
        <div class="state-label">Focused</div>
        <CTextField v-model="val" label="Label" preset="input.blue" :focused="true" />
      </div>
      <div class="state-block">
        <div class="state-label">Filled</div>
        <CTextField v-model="filled" label="Label" preset="input.blue" />
      </div>
      <div class="state-block">
        <div class="state-label">Error</div>
        <CTextField
          v-model="val"
          label="Label"
          preset="input.blue"
          :rules="[() => ({ valid: false, message: 'Validation error' })]"
          validate-on="blur"
          :focused="false"
        />
      </div>
      <div class="state-block">
        <div class="state-label">Disabled</div>
        <CTextField v-model="val" label="Label" preset="input.blue" disabled />
      </div>
      <div class="state-block">
        <div class="state-label">Readonly</div>
        <CTextField v-model="readonly" label="Label" preset="input.blue" readonly />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const val = ref('')
const filled = ref('Hello world')
const readonly = ref('Cannot edit this')
</script>

<style scoped>
.ex-wrap {
  padding: 24px;
}
.states-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.state-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.state-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: .5;
}
@media (max-width: 600px) {
  .states-grid { grid-template-columns: 1fr 1fr; }
}
</style>
