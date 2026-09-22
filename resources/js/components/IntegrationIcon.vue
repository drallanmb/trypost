<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import type { IconTone } from '@/lib/iconTones';
import { cn } from '@/lib/utils';

const props = withDefaults(
    defineProps<{
        tone?: IconTone;
        tile?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    { tone: 'neutral', tile: false },
);
</script>

<template>
    <span
        :data-integration-tone="tone"
        :class="
            cn(
                'inline-flex shrink-0 items-center justify-center align-middle text-[var(--integration-ink)]',
                tile
                    ? 'size-12 rounded-2xl bg-[var(--integration-tint)] p-3'
                    : 'size-5',
                props.class,
            )
        "
        ><slot
    /></span>
</template>
