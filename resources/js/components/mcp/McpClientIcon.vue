<script setup lang="ts">
import { IconPlugConnected } from '@tabler/icons-vue';
import { computed, type HTMLAttributes } from 'vue';

import IntegrationIcon from '@/components/IntegrationIcon.vue';

const props = defineProps<{
    client: string;
    class?: HTMLAttributes['class'];
}>();

// Preserve provider color families with theme-aware ink and pastel surfaces.
const clients = {
    claude: { asset: 'claude.svg', tone: 'coral' },
    chatgpt: { asset: 'chatgpt-white.svg', tone: 'graphite' },
    cursor: { asset: 'cursor.svg', tone: 'graphite' },
    vscode: { asset: 'vscode.svg', tone: 'blue' },
    claude_code: { asset: 'claude.svg', tone: 'coral' },
    other: { asset: 'other-clients.svg', tone: 'plum' },
} as const;

const appearance = computed(() =>
    Object.hasOwn(clients, props.client)
        ? clients[props.client as keyof typeof clients]
        : undefined,
);
</script>

<template>
    <IntegrationIcon
        :tone="appearance?.tone ?? 'neutral'"
        tile
        :class="props.class"
        aria-hidden="true"
    >
        <span
            v-if="appearance"
            class="integration-mask size-full bg-current"
            :style="{ maskImage: `url('/images/ai/${appearance.asset}')` }"
        />
        <IconPlugConnected v-else class="size-full" stroke="1.65" />
    </IntegrationIcon>
</template>
