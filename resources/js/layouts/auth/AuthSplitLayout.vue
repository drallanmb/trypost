<script setup lang="ts">
import {
    IconCalendar,
    IconClock,
    IconHash,
    IconPhoto,
    IconUsers,
    IconVideo,
} from '@tabler/icons-vue';
import { trans } from 'laravel-vue-i18n';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { PRODUCT_NAME } from '@/brand';
import ProductBrand from '@/components/brand/ProductBrand.vue';
import PlatformIcon from '@/components/PlatformIcon.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

defineProps<{
    title?: string;
    description?: string;
}>();

const slideKeys = [
    'calendar',
    'scheduling',
    'media',
    'video',
    'team',
    'signatures',
] as const;

const slideIcons = {
    calendar: IconCalendar,
    scheduling: IconClock,
    media: IconPhoto,
    video: IconVideo,
    team: IconUsers,
    signatures: IconHash,
};

const slides = computed(() =>
    slideKeys.map((key) => ({
        icon: slideIcons[key],
        title: trans(`auth.slides.${key}.title`),
        description: trans(`auth.slides.${key}.description`),
    })),
);

const activeIndex = ref(0);
const isPaused = ref(false);
const reducedMotion = ref(false);
let motionPreference: MediaQueryList | undefined;
const updateMotionPreference = () => {
    reducedMotion.value = motionPreference?.matches ?? false;
};
let intervalId: ReturnType<typeof setInterval> | null = null;

const activeSlide = computed(() => slides.value[activeIndex.value]);

const goTo = (index: number) => {
    activeIndex.value = index;
    restartInterval();
};

const startInterval = () => {
    intervalId = setInterval(() => {
        if (!isPaused.value && !reducedMotion.value) {
            activeIndex.value = (activeIndex.value + 1) % slides.value.length;
        }
    }, 4000);
};

const restartInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    startInterval();
};

onMounted(() => {
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);
    startInterval();
});

onBeforeUnmount(() => {
    motionPreference?.removeEventListener('change', updateMotionPreference);
    if (intervalId) {
        clearInterval(intervalId);
    }
});

const platforms = [
    { name: 'LinkedIn', value: 'linkedin' },
    { name: 'X', value: 'x' },
    { name: 'Instagram', value: 'instagram' },
    { name: 'Facebook', value: 'facebook' },
    { name: 'TikTok', value: 'tiktok' },
    { name: 'YouTube', value: 'youtube' },
    { name: 'Threads', value: 'threads' },
    { name: 'Pinterest', value: 'pinterest' },
    { name: 'Bluesky', value: 'bluesky' },
    { name: 'Mastodon', value: 'mastodon' },
];
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

        <div
            class="relative hidden overflow-hidden rounded-[30px] border border-border bg-secondary lg:sticky lg:top-5 lg:block lg:h-[calc(100svh-2.5rem)] lg:self-start"
            @mouseenter="isPaused = true"
            @mouseleave="isPaused = false"
            @focusin="isPaused = true"
            @focusout="isPaused = false"
        >
            <!-- Atmospheric color stays in the promotional half. -->
            <div
                class="pointer-events-none absolute -top-24 -right-24 size-[440px] rounded-full bg-brand-plum/15 blur-3xl"
            />
            <div
                class="pointer-events-none absolute -bottom-32 -left-32 size-[440px] rounded-full bg-primary/20 blur-3xl"
            />

            <!-- Dot pattern overlay (subtle). -->
            <div
                class="pointer-events-none absolute inset-0 opacity-[0.06]"
                style="
                    background-image: radial-gradient(
                        circle,
                        var(--foreground) 1px,
                        transparent 1px
                    );
                    background-size: 28px 28px;
                "
            />

            <div
                class="relative flex h-full flex-col items-center justify-center px-12 xl:px-16"
            >
                <!-- Mockup card carousel -->
                <div class="relative h-[280px] w-full max-w-md">
                    <template v-for="(slide, index) in slides" :key="index">
                        <Transition
                            enter-active-class="transition-all duration-500 ease-out"
                            leave-active-class="transition-all duration-500 ease-out"
                            enter-from-class="opacity-0 translate-y-4"
                            enter-to-class="opacity-100 translate-y-0"
                            leave-from-class="opacity-100 translate-y-0"
                            leave-to-class="opacity-0 -translate-y-4"
                        >
                            <div
                                v-if="activeIndex === index"
                                class="absolute inset-0 flex items-center justify-center"
                            >
                                <div
                                    class="w-full overflow-hidden rounded-[22px] border border-border bg-card shadow-xl"
                                >
                                    <!-- Title bar with traffic lights + live badge -->
                                    <div
                                        class="flex items-center gap-3 border-b border-border bg-card px-4 py-3"
                                    >
                                        <div class="flex gap-1.5">
                                            <span
                                                class="size-2.5 rounded-full bg-primary"
                                            />
                                            <span
                                                class="size-2.5 rounded-full bg-brand-yellow"
                                            />
                                            <span
                                                class="size-2.5 rounded-full bg-success"
                                            />
                                        </div>
                                        <div
                                            class="ml-2 truncate text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                                        >
                                            {{ PRODUCT_NAME }}
                                        </div>
                                        <span
                                            class="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold tracking-widest text-foreground uppercase"
                                        >
                                            <span
                                                class="relative flex size-1.5"
                                            >
                                                <span
                                                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/80"
                                                />
                                                <span
                                                    class="relative inline-flex size-1.5 rounded-full bg-success"
                                                />
                                            </span>
                                            Live
                                        </span>
                                    </div>

                                    <!-- Body: feature icon -->
                                    <div
                                        class="flex items-center justify-center bg-card py-8"
                                    >
                                        <div
                                            class="flex size-20 items-center justify-center rounded-[22px] border border-border bg-secondary text-accent-foreground shadow-sm"
                                        >
                                            <component
                                                :is="slide.icon"
                                                class="size-10"
                                            />
                                        </div>
                                    </div>

                                    <!-- Platform strip -->
                                    <div
                                        class="flex flex-wrap justify-center gap-2 border-t border-border bg-card px-4 py-3"
                                    >
                                        <PlatformIcon
                                            v-for="platform in platforms"
                                            :key="platform.name"
                                            :platform="platform.value"
                                            :label="platform.name"
                                            class="size-7 rounded-full border border-border bg-secondary/50 p-1.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </template>
                </div>

                <!-- Text content -->
                <div class="mt-10 w-full max-w-md text-center">
                    <div class="relative h-[100px]">
                        <TransitionGroup
                            enter-active-class="transition-all duration-400 ease-out"
                            leave-active-class="transition-all duration-300 ease-in"
                            enter-from-class="opacity-0 translate-y-2"
                            enter-to-class="opacity-100 translate-y-0"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <div
                                :key="activeIndex"
                                class="absolute inset-x-0 top-0"
                            >
                                <h3 class="h3 text-foreground">
                                    {{ activeSlide.title }}
                                </h3>
                                <p
                                    class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-foreground"
                                >
                                    {{ activeSlide.description }}
                                </p>
                            </div>
                        </TransitionGroup>
                    </div>

                    <!-- Dots -->
                    <div class="flex items-center justify-center gap-2">
                        <button
                            v-for="(_, index) in slides"
                            :key="index"
                            type="button"
                            :aria-label="slides[index].title"
                            :aria-current="
                                activeIndex === index ? 'true' : undefined
                            "
                            class="group relative flex size-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            @click="goTo(index)"
                        >
                            <span
                                class="block h-1.5 rounded-full border border-foreground transition-all duration-300"
                                :class="
                                    activeIndex === index
                                        ? 'w-6 bg-foreground'
                                        : 'w-1.5 bg-card group-hover:bg-foreground/30'
                                "
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
