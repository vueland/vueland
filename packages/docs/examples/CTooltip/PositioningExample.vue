<template>
  <div class="d-flex justify-center align-center pa-10">
    <div class="grid">
      <!-- row 1 -->
      <div />
      <CTooltip width="auto" open-on-hover close-on-leave align="top-center" :offset-y="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-indigo elevation-2 text-white" v-bind="activator" v-on="on" style="gap:6px">
            <CIcon name="fas:chevron-down" source="fa" :size="11" style="transform:rotate(180deg)" /> Top
          </CBtn>
        </template>
        align="top-center"
      </CTooltip>
      <div />

      <!-- row 2 -->
      <CTooltip width="auto" open-on-hover close-on-leave align="left-center" :offset-x="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-teal elevation-2 text-white" v-bind="activator" v-on="on" style="gap:6px">
            <CIcon name="fas:chevron-down" source="fa" :size="11" style="transform:rotate(90deg)" /> Left
          </CBtn>
        </template>
        align="left-center"
      </CTooltip>

      <div class="dot-wrap">
        <div class="dot" />
      </div>

      <CTooltip width="auto" open-on-hover close-on-leave align="right-center" :offset-x="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-deep-purple elevation-2 text-white" v-bind="activator" v-on="on" style="gap:6px">
            Right <CIcon name="fas:chevron-down" source="fa" :size="11" style="transform:rotate(-90deg)" />
          </CBtn>
        </template>
        align="right-center"
      </CTooltip>

      <!-- row 3 -->
      <div />
      <CTooltip width="auto" open-on-hover close-on-leave align="bottom-center" :offset-y="8">
        <template #activator="{ on, activator }">
          <CBtn class="bg-amber elevation-2 text-white" v-bind="activator" v-on="on" style="gap:6px">
            <CIcon name="fas:chevron-down" source="fa" :size="11" /> Bottom
          </CBtn>
        </template>
        align="bottom-center"
      </CTooltip>
      <div />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 16px;
  align-items: center;
  justify-items: center;
}
.dot-wrap { display: flex; align-items: center; justify-content: center; padding: 20px }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-app-border-color) }
</style>
