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

import IntegrationIcon from '@/components/IntegrationIcon.vue';
import { getPlatformLabel } from '@/composables/usePlatformLogo';
import type { IconTone } from '@/lib/iconTones';
import { Platform, type PlatformValue } from '@/types/platform';

const props = withDefaults(
    defineProps<{
        platform: string;
        label?: string;
        decorative?: boolean;
        tile?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    { decorative: false, tile: false },
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

const tones = {
    [Platform.LinkedIn]: 'blue',
    [Platform.LinkedInPage]: 'blue',
    [Platform.X]: 'graphite',
    [Platform.TikTok]: 'rose',
    [Platform.YouTube]: 'red',
    [Platform.Facebook]: 'blue',
    [Platform.Instagram]: 'rose',
    [Platform.InstagramFacebook]: 'rose',
    [Platform.Threads]: 'graphite',
    [Platform.Pinterest]: 'red',
    [Platform.Bluesky]: 'blue',
    [Platform.Mastodon]: 'plum',
    [Platform.Telegram]: 'cyan',
    [Platform.Discord]: 'indigo',
} as const satisfies Record<PlatformValue, IconTone>;

const tone = computed(() =>
    Object.hasOwn(tones, props.platform)
        ? tones[props.platform as PlatformValue]
        : 'neutral',
);
</script>

<template>
    <IntegrationIcon
        :tone="tone"
        :tile="tile"
        :class="props.class"
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
    </IntegrationIcon>
</template>
