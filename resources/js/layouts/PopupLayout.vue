<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

import ProductBrand from '@/components/brand/ProductBrand.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

interface Props {
    title?: string;
}

defineProps<Props>();
</script>

<template>
    <Head :title="title" />

    <div class="min-h-screen bg-background p-6">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <ProductBrand />
            <ThemeToggle compact />
        </div>
        <slot />
    </div>
</template>
