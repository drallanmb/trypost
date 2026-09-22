<script setup lang="ts">
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue';
import { trans } from 'laravel-vue-i18n';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { PRODUCT_NAME } from '@/brand';
import AuthFeatureScene from '@/components/auth/AuthFeatureScene.vue';
import PlatformIcon from '@/components/PlatformIcon.vue';
import {
    authFeatures,
    createStoryPlayback,
    storyDuration,
} from '@/lib/authStory';

const playback = createStoryPlayback(authFeatures.length);
const active = computed(() => authFeatures[playback.state.index]);
const manuallyPaused = ref(false);
const hovered = ref(false);
const focused = ref(false);
const reducedMotion = ref(false);
const desktop = ref(false);
let preference: MediaQueryList | undefined;
let viewport: MediaQueryList | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let previousTime = 0;
const paused = computed(
    () =>
        manuallyPaused.value ||
        hovered.value ||
        focused.value ||
        reducedMotion.value ||
        !desktop.value,
);
const platforms = [
    'linkedin',
    'x',
    'instagram',
    'facebook',
    'tiktok',
    'youtube',
    'threads',
    'pinterest',
    'bluesky',
    'mastodon',
];

function resetTime() {
    previousTime = performance.now();
}
function updatePreferences() {
    reducedMotion.value = preference?.matches ?? false;
    desktop.value = viewport?.matches ?? false;
    resetTime();
}
function leaveFocus(event: FocusEvent) {
    focused.value = (event.currentTarget as HTMLElement).contains(
        event.relatedTarget as Node | null,
    );
}

onMounted(() => {
    preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    viewport = window.matchMedia('(min-width: 1024px)');
    updatePreferences();
    preference.addEventListener('change', updatePreferences);
    viewport.addEventListener('change', updatePreferences);
    document.addEventListener('visibilitychange', resetTime);
    timer = setInterval(() => {
        const now = performance.now();
        playback.advance(now - previousTime, paused.value || document.hidden);
        previousTime = now;
    }, 50);
});
onBeforeUnmount(() => {
    clearInterval(timer);
    preference?.removeEventListener('change', updatePreferences);
    viewport?.removeEventListener('change', updatePreferences);
    document.removeEventListener('visibilitychange', resetTime);
});
</script>

<template>
    <aside
        class="auth-story relative hidden overflow-clip rounded-[30px] border border-border bg-secondary lg:sticky lg:top-5 lg:flex lg:h-[calc(100svh-2.5rem)] lg:self-start"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @focusin="focused = true"
        @focusout="leaveFocus"
    >
        <div
            class="pointer-events-none absolute -top-24 -right-24 size-[440px] rounded-full bg-brand-plum/15 blur-3xl"
        />
        <div
            class="pointer-events-none absolute -bottom-32 -left-32 size-[440px] rounded-full bg-primary/15 blur-3xl"
        />
        <div class="story-grain pointer-events-none absolute inset-0" />
        <div
            class="story-content relative m-auto w-full max-w-[600px] px-6 py-8 xl:px-10"
        >
            <div
                class="story-window overflow-hidden rounded-[22px] border border-border bg-card"
            >
                <div
                    class="flex items-center gap-3 border-b border-border px-4 py-3.5"
                >
                    <div class="flex gap-1.5" aria-hidden="true">
                        <span class="size-2 rounded-full bg-primary" /><span
                            class="size-2 rounded-full bg-brand-yellow"
                        /><span class="size-2 rounded-full bg-success" />
                    </div>
                    <span
                        class="truncate text-[9px] font-semibold tracking-[.12em] text-muted-foreground uppercase"
                        >{{ PRODUCT_NAME }}</span
                    >
                    <span
                        class="ml-auto text-[10px] tracking-widest text-muted-foreground tabular-nums"
                        aria-hidden="true"
                        >0{{ playback.state.index + 1 }} / 06</span
                    >
                </div>
                <div class="story-stage">
                    <Transition
                        name="scene-iris"
                        :css="!reducedMotion"
                        :duration="700"
                    >
                        <AuthFeatureScene
                            :key="active"
                            :feature="active"
                            class="story-scene"
                        />
                    </Transition>
                </div>
                <div
                    class="flex flex-wrap justify-center gap-2 border-t border-border px-3 py-3"
                    aria-hidden="true"
                >
                    <PlatformIcon
                        v-for="platform in platforms"
                        :key="platform"
                        :platform="platform"
                        class="size-7 rounded-full border border-border bg-secondary/50 p-1.5"
                    />
                </div>
            </div>

            <div class="story-copy mt-8 text-center" aria-live="off">
                <Transition
                    name="story-copy"
                    :css="!reducedMotion"
                    :duration="550"
                >
                    <div :key="active" class="story-caption">
                        <div class="overflow-hidden">
                            <h2
                                class="story-title font-display text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight text-foreground"
                            >
                                {{ trans(`auth.slides.${active}.title`) }}
                            </h2>
                        </div>
                        <div class="overflow-hidden">
                            <p
                                class="story-description mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground"
                            >
                                {{ trans(`auth.slides.${active}.description`) }}
                            </p>
                        </div>
                    </div>
                </Transition>
            </div>
            <div
                class="mx-auto flex max-w-xs items-center justify-center gap-2"
            >
                <button
                    v-for="(feature, index) in authFeatures"
                    :key="feature"
                    type="button"
                    :data-story-select="feature"
                    :aria-label="trans(`auth.slides.${feature}.title`)"
                    :aria-current="
                        playback.state.index === index ? 'true' : undefined
                    "
                    class="story-selector group flex h-9 min-w-0 flex-1 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    @click="playback.select(index)"
                >
                    <span
                        class="h-[3px] w-full overflow-hidden rounded-full bg-foreground/15"
                        ><span
                            class="story-progress block h-full origin-left rounded-full bg-foreground/70"
                            :style="{
                                transform: `scaleX(${index < playback.state.index ? 1 : index === playback.state.index ? (reducedMotion ? 1 : Math.max(0.04, playback.state.elapsed / storyDuration)) : 0})`,
                            }"
                    /></span>
                </button>
                <button
                    type="button"
                    data-testid="story-pause"
                    class="ml-2 flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                    :aria-label="
                        trans(
                            manuallyPaused
                                ? 'auth.story.resume'
                                : 'auth.story.pause',
                        )
                    "
                    :aria-pressed="manuallyPaused || reducedMotion"
                    :disabled="reducedMotion"
                    @click="manuallyPaused = !manuallyPaused"
                >
                    <component
                        :is="
                            manuallyPaused || reducedMotion
                                ? IconPlayerPlay
                                : IconPlayerPause
                        "
                        class="size-3.5"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.story-grain {
    opacity: 0.055;
    background-image: radial-gradient(
        circle,
        var(--foreground) 0.8px,
        transparent 0.8px
    );
    background-size: 28px 28px;
}
.story-window {
    box-shadow:
        0 18px 60px -25px color-mix(in srgb, var(--brand-plum) 28%, transparent),
        0 3px 10px color-mix(in srgb, var(--foreground) 3%, transparent);
}
.story-stage {
    position: relative;
    isolation: isolate;
    height: 292px;
    overflow: hidden;
}
.story-scene {
    position: absolute;
    inset: 0;
}
.scene-iris-enter-active {
    z-index: 2;
    transition: clip-path 700ms cubic-bezier(0.65, 0, 0.35, 1);
}
.scene-iris-enter-from {
    clip-path: circle(0% at 72% 38%);
}
.scene-iris-enter-to {
    clip-path: circle(145% at 72% 38%);
}
.scene-iris-leave-active {
    z-index: 1;
}
.story-copy {
    position: relative;
    min-height: 142px;
}
.story-caption {
    position: absolute;
    inset: 0;
}
.story-copy-enter-active .story-title {
    transition:
        transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 350ms ease;
}
.story-copy-enter-active .story-description {
    transition:
        transform 450ms cubic-bezier(0.22, 1, 0.36, 1) 100ms,
        opacity 350ms ease 100ms;
}
.story-copy-enter-from .story-title,
.story-copy-enter-from .story-description {
    transform: translateY(110%);
    opacity: 0;
}
.story-copy-leave-active {
    transition: opacity 150ms ease;
}
.story-copy-leave-to {
    opacity: 0;
}
.story-progress {
    transition: transform 50ms linear;
}
.story-selector:hover .story-progress {
    background: var(--foreground);
}
@media (prefers-reduced-motion: reduce) {
    .auth-story *,
    .auth-story *::before,
    .auth-story *::after {
        animation: none !important;
        transition: none !important;
    }
}
@media (max-height: 700px) and (min-width: 1024px) {
    .auth-story {
        position: relative;
        height: auto;
        min-height: calc(100svh - 2.5rem);
    }
}
</style>
