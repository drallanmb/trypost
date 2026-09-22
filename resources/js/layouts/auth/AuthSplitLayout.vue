<script setup lang="ts">
import AuthFeatureStory from '@/components/auth/AuthFeatureStory.vue';
import ProductBrand from '@/components/brand/ProductBrand.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div class="grid min-h-svh grid-cols-1 gap-4 p-3 lg:grid-cols-2 lg:p-5">
        <div
            class="flex min-w-0 flex-col gap-8 rounded-[26px] border border-border bg-card p-5 shadow-sm md:p-8"
        >
            <div class="flex flex-wrap items-center justify-between gap-3">
                <ProductBrand />
                <ThemeToggle />
            </div>

            <div class="flex flex-1 items-center justify-center">
                <div class="w-full max-w-md py-8">
                    <div class="flex flex-col gap-6">
                        <div
                            class="flex flex-col items-center gap-2 text-center"
                        >
                            <h1
                                v-if="title"
                                class="font-display text-4xl leading-tight"
                            >
                                {{ title }}
                            </h1>
                            <p
                                v-if="description"
                                class="text-sm text-balance text-muted-foreground"
                            >
                                {{ description }}
                            </p>
                        </div>

                        <slot />
                    </div>
                </div>
            </div>
        </div>

        <AuthFeatureStory />
    </div>
</template>
