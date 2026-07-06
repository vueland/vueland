<script setup lang="ts">
    import { computed, ref } from 'vue'

    type Member = {
        name: string
        email: string
        role: string
        color: string
        online: boolean
    }

    const invited = ref<Member[]>([])

    const members: Member[] = [
        {
            name: 'Anna Smith',
            email: 'anna@vueland.dev',
            role: 'Design',
            color: 'bg-pink',
            online: true,
        },
        {
            name: 'Boris Lee',
            email: 'boris@vueland.dev',
            role: 'Frontend',
            color: 'bg-indigo',
            online: true,
        },
        {
            name: 'Clara Diaz',
            email: 'clara@vueland.dev',
            role: 'Product',
            color: 'bg-teal',
            online: false,
        },
        {
            name: 'Daniel Kim',
            email: 'daniel@vueland.dev',
            role: 'QA',
            color: 'bg-orange',
            online: false,
        },
        {
            name: 'Elena Popova',
            email: 'elena@vueland.dev',
            role: 'Frontend',
            color: 'bg-indigo',
            online: true,
        },
    ]

    const initials = (member: Member) =>
        member.name.split(' ').map(part => part[0]).join('')

    const isInvited = (member: Member) => invited.value.includes(member)

    const uninvite = (member: Member) => {
        invited.value = invited.value.filter(it => it !== member)
    }

    const seats = computed(() => `${invited.value.length} of ${members.length} invited`)
</script>

<template>
    <div class="d-flex justify-center pa-8">
        <c-card
            class="invite-card elevation-3 radius-16 pa-6"
        >
            <div class="d-flex items-center gap-2 mb-1">
                <c-icon
                    name="fas:user"
                    source="fa"
                    :size="14"
                    class="text-indigo"
                />
                <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                    Invite teammates
                </span>
                <span class="invite-card__seats radius-pill px-3 py-1 fs-xs fw-semi-bold">
                    {{ seats }}
                </span>
            </div>

            <c-autocomplete
                v-model="invited"
                label="Teammates"
                placeholder="Search by name"
                title-key="name"
                :items="members"
                multiple
                chips
                clearable
                class="mt-4"
            >
                <!-- Кастомные чипы: аватар + имя + своё удаление -->
                <template #chips>
                    <div
                        v-for="member of invited"
                        :key="member.email"
                        class="invite-chip radius-pill"
                        @mousedown.stop
                    >
                        <span
                            class="invite-avatar invite-avatar--xs"
                            :class="member.color"
                        >
                            {{ initials(member) }}
                        </span>
                        <span class="fs-xs fw-medium">{{ member.name.split(' ')[0] }}</span>
                        <c-icon
                            name="fas:times"
                            source="fa"
                            :size="10"
                            class="invite-chip__close"
                            @click.stop="uninvite(member)"
                        />
                    </div>
                </template>

                <!-- Кастомное меню: свой лейаут поверх items + onSelect -->
                <template #menu="{ items, onSelect }">
                    <div class="invite-menu radius-12 elevation-4">
                        <div class="invite-menu__head d-flex items-center gap-2 px-4 py-2">
                            <span class="fs-xs fw-semi-bold text-uppercase text-blue-grey">
                                Team directory
                            </span>
                            <span class="fs-xs text-blue-grey">
                                {{ items.length }} match{{ items.length === 1 ? '' : 'es' }}
                            </span>
                        </div>

                        <div
                            v-if="!items.length"
                            class="d-flex items-center gap-2 px-4 py-4 fs-sm text-blue-grey"
                        >
                            <c-icon
                                name="fas:user"
                                source="fa"
                                :size="14"
                            />
                            Nobody matches this search
                        </div>

                        <c-list
                            v-else
                            variant="menu"
                            class="invite-menu__list"
                        >
                            <c-list-item
                                v-for="item of items"
                                :key="item.key"
                                :value="item.raw"
                                class="invite-menu__option radius-8"
                                @click="onSelect(item.raw)"
                            >
                                <span
                                    class="invite-avatar"
                                    :class="item.raw.color"
                                >
                                    {{ initials(item.raw) }}
                                    <i
                                        class="invite-avatar__dot"
                                        :class="item.raw.online ? 'bg-green' : 'bg-grey'"
                                    ></i>
                                </span>

                                <c-list-item-content>
                                    <c-list-item-title class="fw-medium">
                                        {{ item.title }}
                                    </c-list-item-title>
                                    <c-list-item-subtitle>
                                        {{ item.raw.email }}
                                    </c-list-item-subtitle>
                                </c-list-item-content>

                                <span class="invite-menu__role radius-pill px-3 py-1 fs-xs fw-semi-bold">
                                    {{ item.raw.role }}
                                </span>
                                <c-icon
                                    v-if="isInvited(item.raw)"
                                    name="fas:check"
                                    source="fa"
                                    :size="14"
                                    class="text-teal"
                                />
                            </c-list-item>
                        </c-list>
                    </div>
                </template>
            </c-autocomplete>
        </c-card>
    </div>
</template>

<style scoped>
.invite-card {
  width: min(100%, 460px);
}
.invite-card__seats {
  margin-left: auto;
  background: var(--c-sys-color-surface-variant);
  color: var(--c-sys-color-on-surface-variant);
}
.invite-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 4px;
  background: var(--c-sys-color-surface-container);
}
.invite-chip__close {
  cursor: pointer;
  color: var(--c-sys-color-on-surface-variant);
}
.invite-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}
.invite-avatar--xs {
  flex-basis: 22px;
  width: 22px;
  height: 22px;
  font-size: 9px;
}
.invite-avatar__dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid var(--c-sys-color-surface);
}
.invite-menu {
  min-width: 380px;
  background: var(--c-sys-color-surface);
  overflow: hidden;
}
.invite-menu__head {
  justify-content: space-between;
  border-bottom: 1px solid var(--c-sys-color-outline-variant);
}
.invite-menu__list {
  padding: 8px;
}
.invite-menu__option {
  gap: 12px;
  padding: 8px 12px;
}
.invite-menu__role {
  flex: 0 0 auto;
  background: var(--c-sys-color-surface-variant);
  color: var(--c-sys-color-on-surface-variant);
}
@media (max-width: 640px) {
  .invite-menu {
    min-width: 300px;
  }
}
</style>
