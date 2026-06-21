---
layout: false
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/en/'))
})
</script>

<template>
  <main class="vueland-root-redirect">
    <p>Redirecting to English documentation...</p>
  </main>
</template>
