<script setup lang="ts">
import {
    IconBrandBluesky,
    IconBrandDiscord,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandMastodon,
    IconBrandPinterest,
    IconBrandTelegram,
    IconBrandThreads,
    IconBrandTiktok,
    IconBrandX,
    IconBrandYoutube,
    IconWorld,
} from '@tabler/icons-vue';
import { computed, type Component, type HTMLAttributes } from 'vue';

import { getPlatformLabel } from '@/composables/usePlatformLogo';
import { cn } from '@/lib/utils';
import { Platform, type PlatformValue } from '@/types/platform';

const props = withDefaults(
    defineProps<{
        platform: string;
        label?: string;
        decorative?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    { decorative: false },
);

// UI glyphs are separate from the native assets used inside social previews.
const icons = {
    [Platform.LinkedIn]: IconBrandLinkedin,
    [Platform.LinkedInPage]: IconBrandLinkedin,
    [Platform.X]: IconBrandX,
    [Platform.TikTok]: IconBrandTiktok,
    [Platform.YouTube]: IconBrandYoutube,
    [Platform.Facebook]: IconBrandFacebook,
    [Platform.Instagram]: IconBrandInstagram,
    [Platform.InstagramFacebook]: IconBrandInstagram,
    [Platform.Threads]: IconBrandThreads,
    [Platform.Pinterest]: IconBrandPinterest,
    [Platform.Bluesky]: IconBrandBluesky,
    [Platform.Mastodon]: IconBrandMastodon,
    [Platform.Telegram]: IconBrandTelegram,
    [Platform.Discord]: IconBrandDiscord,
} satisfies Record<PlatformValue, Component>;

const icon = computed(() =>
    Object.hasOwn(icons, props.platform)
        ? icons[props.platform as PlatformValue]
        : IconWorld,
);
</script>

<template>
    <span
        :class="
            cn(
                'inline-flex size-5 shrink-0 items-center justify-center align-middle text-foreground',
                props.class,
            )
        "
        :role="decorative ? undefined : 'img'"
        :aria-label="
            decorative ? undefined : (label ?? getPlatformLabel(platform))
        "
        :aria-hidden="decorative ? true : undefined"
        :data-platform-icon="platform"
    >
        <component
            :is="icon"
            class="size-full"
            stroke="1.65"
            aria-hidden="true"
            focusable="false"
        />
    </span>
</template>
