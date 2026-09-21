<script setup lang="ts">
import ProductBrand from '@/components/brand/ProductBrand.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

const { state, isMobile } = useSidebar();
</script>

<template>
    <header
        class="flex h-18 shrink-0 items-center justify-between gap-3 bg-transparent px-4 sm:px-6 lg:px-8"
    >
        <div class="flex min-w-0 items-center gap-2">
            <SidebarTrigger v-if="isMobile" class="-ml-1" />
            <ProductBrand v-if="state === 'collapsed' || isMobile" compact />
            <slot name="left" />
        </div>
        <div class="flex min-w-0 items-center gap-2">
            <slot name="right" />
            <ThemeToggle compact />
        </div>
    </header>
</template>
