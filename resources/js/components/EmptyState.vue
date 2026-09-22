<script setup lang="ts">
import type { Component } from 'vue';

import AppIcon from '@/components/AppIcon.vue';
defineProps<{
    icon: Component;
    title: string;
    description: string;
}>();
</script>

<template>
    <div
        class="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card p-12 text-center"
    >
        <AppIcon :icon="icon" class="size-16 p-4" />
        <div class="space-y-1">
            <h3
                class="text-xl text-foreground"
                style="font-family: var(--font-display)"
            >
                {{ title }}
            </h3>
            <p class="text-sm text-foreground/60">{{ description }}</p>
        </div>
        <div v-if="$slots.action" class="mt-2">
            <slot name="action" />
        </div>
    </div>
</template>
