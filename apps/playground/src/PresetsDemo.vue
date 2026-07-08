<script setup lang="ts">
    import { shallowRef } from 'vue'

    const framework = shallowRef<string>()
    const skills = shallowRef(['Vue'])
    const assignee = shallowRef<number>()
    const region = shallowRef<string>()
    const listValue = shallowRef<string>()
    const listDisabled = shallowRef(false)

    const frameworks = ['Vue', 'React', 'Svelte', 'Angular', 'Solid', 'Qwik']
    const allSkills = ['Vue', 'React', 'TypeScript', 'Node.js', 'Go', 'Rust']
    const regions = ['US East', 'EU West', 'Asia Pacific']

    const members = [
        { id: 1, name: 'Anna Smith' },
        { id: 2, name: 'Boris Lee' },
        { id: 3, name: 'Clara Diaz' },
    ]

    const requiredRule = [
        (val?: string) => ({
            valid: !!val,
            message: 'Required',
        }),
    ]
</script>

<template>
    <div class="py-5">
        <c-row>
            <!-- Комбо-пресет: поле + меню + список одним пресетом -->
            <c-col
                xxl="3"
                xl="3"
                lg="6"
                md="6"
                class="pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h3>Комбо-пресет input.soft</h3>
                    </c-card-header>
                    <c-card-body>
                        <div class="fs-sm text-blue-grey mb-4">
                            Один preset красит поле, меню и список: вложенные
                            CMenuPreset/CListPreset доезжают через контекст.
                        </div>
                        <c-select
                            v-model="framework"
                            label="Framework"
                            preset="input.soft"
                            :items="frameworks"
                            clearable
                        />
                        <c-autocomplete
                            v-model="skills"
                            label="Skills"
                            preset="input.soft"
                            :items="allSkills"
                            multiple
                            chips
                            clearable
                            class="mt-4"
                        />
                    </c-card-body>
                </c-card>
            </c-col>

            <!-- Тот же механизм, другое сочетание вложенных пресетов -->
            <c-col
                xxl="3"
                xl="3"
                lg="6"
                md="6"
                class="pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h3>Комбо-пресет input.outline</h3>
                    </c-card-header>
                    <c-card-body>
                        <div class="fs-sm text-blue-grey mb-4">
                            Переиспользование: то же поле, но menu.dark +
                            list.compact внутри.
                        </div>
                        <c-select
                            v-model="region"
                            label="Region"
                            preset="input.outline"
                            :items="regions"
                            clearable
                        />
                        <c-autocomplete
                            v-model="assignee"
                            label="Assignee"
                            preset="input.outline"
                            title-key="name"
                            value-key="id"
                            :items="members"
                            :rules="requiredRule"
                            validate-on="blur"
                            details="Validated on blur"
                            clearable
                            class="mt-4"
                        />
                    </c-card-body>
                </c-card>
            </c-col>

            <!-- Standalone CMenu со своим preset-пропом -->
            <c-col
                xxl="3"
                xl="3"
                lg="6"
                md="6"
                class="pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h3>Standalone CMenu</h3>
                    </c-card-header>
                    <c-card-body>
                        <div class="fs-sm text-blue-grey mb-4">
                            Тот же menu.dark, но через собственный проп
                            preset — состояние opened усиливает тень.
                        </div>
                        <c-menu
                            preset="menu.dark"
                            align="bottom"
                            open-on-click
                            close-on-click-outside
                            close-on-content-click
                            :offset-y="4"
                        >
                            <template #activator="{ on, activator }">
                                <c-btn
                                    v-bind="activator"
                                    color="#37474f"
                                    v-on="on"
                                >
                                    Open menu
                                </c-btn>
                            </template>
                            <c-list
                                variant="menu"
                                class="bg-graphite text-white"
                            >
                                <c-list-item
                                    v-for="item of frameworks"
                                    :key="item"
                                    :value="item"
                                >
                                    <c-list-item-title>{{ item }}</c-list-item-title>
                                </c-list-item>
                            </c-list>
                        </c-menu>
                    </c-card-body>
                </c-card>
            </c-col>

            <!-- Standalone CList со своим preset-пропом и состояниями -->
            <c-col
                xxl="3"
                xl="3"
                lg="6"
                md="6"
                class="pa-1 md:pa-4 lg:pa-1 d-flex"
            >
                <c-card class="elevation-2 align-self-stretch">
                    <c-card-header>
                        <h3>Standalone CList</h3>
                    </c-card-header>
                    <c-card-body>
                        <div class="fs-sm text-blue-grey mb-4">
                            list.compact через проп; disabled-состояние пресета
                            резолвит сам CList.
                        </div>
                        <c-btn
                            color="blue-grey"
                            @click="listDisabled = !listDisabled"
                        >
                            {{ listDisabled ? 'Enable' : 'Disable' }} list
                        </c-btn>
                        <c-list
                            v-model="listValue"
                            preset="list.compact"
                            variant="listbox"
                            :disabled="listDisabled"
                            class="mt-4"
                        >
                            <c-list-item
                                v-for="item of regions"
                                :key="item"
                                :value="item"
                            >
                                <c-list-item-title>{{ item }}</c-list-item-title>
                            </c-list-item>
                        </c-list>
                    </c-card-body>
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>
