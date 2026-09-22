<script setup lang="ts">
import { IconPlugConnected } from '@tabler/icons-vue';
import { computed, type HTMLAttributes } from 'vue';

import IntegrationIcon from '@/components/IntegrationIcon.vue';

const props = defineProps<{
    client: string;
    class?: HTMLAttributes['class'];
}>();

// Reuse local silhouettes; color belongs to the product theme, not the provider.
const clients = {
    claude: { asset: 'claude.svg', tone: 'amber' },
    chatgpt: { asset: 'chatgpt-white.svg', tone: 'plum' },
    cursor: { asset: 'cursor.svg', tone: 'rose' },
    vscode: { asset: 'vscode.svg', tone: 'plum' },
    claude_code: { asset: 'claude.svg', tone: 'amber' },
    other: { asset: 'other-clients.svg', tone: 'rose' },
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
