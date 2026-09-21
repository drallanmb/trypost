<script setup lang="ts">
import { IconMoon, IconSun } from '@tabler/icons-vue';
import { computed } from 'vue';

import { useTheme } from '@/composables/useTheme';

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });

const { theme, toggleTheme } = useTheme();
const label = computed(() => (theme.value === 'solar' ? 'Solar' : 'Afterglow'));
const nextLabel = computed(() =>
    theme.value === 'solar' ? 'Afterglow' : 'Solar',
);
</script>

<template>
    <button
        type="button"
        class="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-3 text-sm font-medium text-foreground shadow-2xs transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        :aria-label="`${label} → ${nextLabel}`"
        :aria-pressed="theme === 'afterglow'"
        :title="`${label} → ${nextLabel}`"
        data-testid="theme-toggle"
        @click="toggleTheme"
    >
        <component
            :is="theme === 'solar' ? IconSun : IconMoon"
            class="size-4"
            aria-hidden="true"
        />
        <span v-if="!compact">{{ label }}</span>
    </button>
</template>
