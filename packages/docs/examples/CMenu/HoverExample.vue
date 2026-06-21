<template>
  <div class="pa-6">
    <div class="d-flex align-center gap-1 pa-2 radius-8 elevation-1 nav">
      <CMenu
        v-for="item in nav"
        :key="item.label"
        width="auto"
        open-on-hover
        close-on-leave
        align="bottom"
        :offset-y="2"
        :open-delay="80"
        :close-delay="140"
      >
        <template #activator="{ on, activator }">
          <CBtn variant="text" :class="item.color" v-bind="activator" v-on="on" style="gap:6px">
            <CIcon :name="item.icon" source="fa" :size="13" />
            {{ item.label }}
          </CBtn>
        </template>

        <CCard class="elevation-4" style="min-width:180px">
          <CCardBody class="py-1 px-0">
            <div class="menu-section px-4 py-2" :style="{ borderLeft: `3px solid ${item.accent}` }">
              <span class="section-title" :style="{ color: item.accent }">{{ item.label }}</span>
            </div>
            <div class="sep" />
            <CList>
              <CListItem
                v-for="link in item.links"
                :key="link.label"
                class="px-4"
                style="gap:10px"
              >
                <CIcon :name="link.icon" source="fa" :size="12" style="width:14px;opacity:.5" />
                {{ link.label }}
              </CListItem>
            </CList>
          </CCardBody>
        </CCard>
      </CMenu>

      <div style="flex:1" />

      <CMenu width="auto" open-on-hover close-on-leave align="bottom-right" :offset-y="2" :open-delay="80" :close-delay="200">
        <template #activator="{ on, activator }">
          <div class="avatar" v-bind="activator" v-on="on">
            <CIcon name="fas:user" source="fa" :size="14" />
          </div>
        </template>

        <CCard class="elevation-4" style="min-width:220px">
          <CCardBody class="px-0 py-0">
            <div class="user-header pa-4 d-flex align-center gap-3">
              <div class="avatar avatar--lg">
                <CIcon name="fas:user" source="fa" :size="17" />
              </div>
              <div>
                <div style="font-weight:600;font-size:14px">Alex Vueland</div>
                <div style="font-size:12px;opacity:.55">alex@vueland.dev</div>
              </div>
            </div>
            <div class="sep" />
            <CList>
              <CListItem class="px-4" style="gap:10px">
                <CIcon name="fas:cog"  source="fa" :size="13" style="width:14px;opacity:.5" /> Settings
              </CListItem>
              <CListItem class="px-4" style="gap:10px">
                <CIcon name="fas:box"  source="fa" :size="13" style="width:14px;opacity:.5" /> Billing
              </CListItem>
              <CListItem class="px-4" style="gap:10px">
                <CIcon name="fas:star" source="fa" :size="13" style="width:14px;opacity:.5" /> Upgrade
              </CListItem>
            </CList>
            <div class="sep" />
            <CList>
              <CListItem class="px-4 text-red" style="gap:10px">
                <CIcon name="fas:sign-out-alt" source="fa" :size="13" style="width:14px" /> Sign out
              </CListItem>
            </CList>
          </CCardBody>
        </CCard>
      </CMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
const nav = [
  {
    label: 'Products',
    icon: 'fas:briefcase',
    color: 'text-indigo',
    accent: '#3f51b5',
    links: [
      { icon: 'fas:list-ul', label: 'UI Components' },
      { icon: 'fas:image',   label: 'Icons' },
      { icon: 'fas:code',    label: 'Templates' },
      { icon: 'fas:star',    label: 'Themes' },
    ],
  },
  {
    label: 'Docs',
    icon: 'fas:code',
    color: 'text-light-blue',
    accent: '#03a9f4',
    links: [
      { icon: 'fas:home',    label: 'Getting started' },
      { icon: 'fas:list-ul', label: 'Components' },
      { icon: 'fas:code',    label: 'Composables' },
      { icon: 'fas:file',    label: 'Migration guide' },
    ],
  },
  {
    label: 'Community',
    icon: 'fas:globe',
    color: 'text-teal',
    accent: '#009688',
    links: [
      { icon: 'fab:github',  label: 'GitHub' },
      { icon: 'fab:twitter', label: 'Twitter / X' },
      { icon: 'fas:globe',   label: 'Newsletter' },
      { icon: 'fas:bell',    label: 'Subscribe' },
    ],
  },
]
</script>

<style scoped>
.nav { background: var(--c-app-surface-color) }
.text-indigo     { color: #3f51b5 !important }
.text-light-blue { color: #03a9f4 !important }
.text-teal       { color: #009688 !important }
.text-red        { color: #f44336 }
.sep { height: 1px; background: var(--c-app-border-color) }
.section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em }
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: #673ab7; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
}
.avatar--lg { width: 42px; height: 42px }
</style>
