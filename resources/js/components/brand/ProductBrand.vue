<script setup lang="ts">
import { PRODUCT_NAME } from '@/brand';

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false });
</script>

<template>
    <span
        class="inline-flex min-w-0 items-center gap-2.5"
        role="img"
        :aria-label="PRODUCT_NAME"
        data-testid="product-brand"
    >
        <svg
            class="size-9 shrink-0"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
        >
            <rect width="40" height="40" rx="13" fill="var(--secondary)" />
            <path
                d="M10 25C10 15 20 10 30 15M10 25C20 30 30 25 30 15"
                stroke="var(--brand-plum)"
                stroke-width="3"
                stroke-linecap="round"
            />
            <circle cx="11" cy="24" r="5" fill="var(--primary)" />
            <circle cx="29" cy="15" r="4" fill="var(--brand-yellow)" />
        </svg>
        <span
            v-if="!compact"
            class="min-w-0 text-sm leading-tight font-semibold tracking-tight"
        >
            {{ PRODUCT_NAME }}
        </span>
    </span>
</template>
