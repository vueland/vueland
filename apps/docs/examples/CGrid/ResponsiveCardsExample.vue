<script setup lang="ts">
    const cards = [
        {
            id: 1,
            emoji: '🎧',
            bgClass: 'bg-deep-purple',
            tag: 'Audio',
            title: 'Wireless Headphones',
            desc: 'Premium sound with active noise cancellation and 30h battery.',
            price: '$129',
        },
        {
            id: 2,
            emoji: '⌚',
            bgClass: 'bg-pink',
            tag: 'Wearable',
            title: 'Smart Watch Pro',
            desc: 'Health tracking, GPS, and AMOLED display in a slim design.',
            price: '$249',
        },
        {
            id: 3,
            emoji: '📸',
            bgClass: 'bg-light-blue',
            tag: 'Camera',
            title: 'Compact Camera',
            desc: '48MP sensor, optical zoom, and 4K video in your pocket.',
            price: '$399',
        },
    ]
</script>

<template>
    <div class="pa-4">
        <c-row align="stretch">
            <c-col
                v-for="card in cards"
                :key="card.id"
                cols="12"
                sm="6"
                md="4"
                class="col-flex"
            >
                <c-card
                    class="elevation-2 radius-16 card-grow"
                    style="overflow: hidden;"
                >
                    <c-card-header
                        class="card-media items-center justify-center"
                        :class="card.bgClass"
                    >
                        <span class="card-icon">{{ card.emoji }}</span>
                    </c-card-header>
                    <c-card-body class="card-body-flex pa-4">
                        <div
                            class="text-uppercase font-weight-bold text-blue mb-1"
                            style="font-size:11px;letter-spacing:.08em"
                        >
                            {{ card.tag }}
                        </div>
                        <div
                            class="font-weight-bold mb-2"
                            style="font-size:16px"
                        >
                            {{ card.title }}
                        </div>
                        <div class="card-desc mb-4">
                            {{ card.desc }}
                        </div>
                        <c-card-footer class="d-flex items-center justify-space-between pa-0">
                            <span
                                class="font-weight-bold"
                                style="font-size:20px"
                            >{{ card.price }}</span>
                            <c-btn
                                variant="outlined"
                                class="radius-pill"
                            >
                                Add →
                            </c-btn>
                        </c-card-footer>
                    </c-card-body>
                </c-card>
            </c-col>
        </c-row>
    </div>
</template>

<style scoped>
.col-flex {
  display: flex;
  flex-direction: column;
}

.card-grow {
  flex: 1;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.card-grow:hover {
  transform: translateY(-4px);
}

.card-media {
  height: 140px;
  display: flex;
}

.card-icon {
  font-size: 56px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
}

.card-body-flex {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-desc {
  font-size: 13px;
  line-height: 1.5;
  flex: 1;
  opacity: .7;
}
</style>
