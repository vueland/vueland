<script setup lang="ts">
    const details = [
        { icon: 'fas:user',           label: 'Full name', value: 'Anna Smith' },
        { icon: 'fas:envelope',       label: 'Email',     value: 'anna.smith@example.com' },
        { icon: 'fas:phone',          label: 'Phone',     value: '+1 (555) 123-4567' },
        { icon: 'fas:briefcase',      label: 'Company',   value: 'Vueland Inc.' },
        { icon: 'fas:map-marker-alt', label: 'Location',  value: 'Berlin, Germany' },
    ]
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="elevation-3 radius-16"
            style="width:360px;overflow:hidden"
        >
            <div class="px-4 pt-4 pb-2 fs-xs fw-semi-bold text-uppercase text-blue-grey">
                Contact details
            </div>

            <c-list class="pa-2">
                <c-list-item
                    v-for="d in details"
                    :key="d.label"
                    class="px-3 py-2"
                >
                    <c-list-item-icon>
                        <c-icon
                            :name="d.icon"
                            source="fa"
                            :size="14"
                            class="text-blue-grey"
                        />
                    </c-list-item-icon>

                    <c-list-item-content>
                        <c-list-item-subtitle>{{ d.label }}</c-list-item-subtitle>
                        <c-list-item-title class="fw-medium">
                            {{ d.value }}
                        </c-list-item-title>
                    </c-list-item-content>
                </c-list-item>
            </c-list>
        </c-card>
    </div>
</template>
