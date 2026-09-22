<script setup lang="ts">
import {
    IconAffiliate,
    IconBell,
    IconBolt,
    IconBrandDiscord,
    IconCalendar,
    IconChartBar,
    IconClock,
    IconCloudUpload,
    IconFileCheck,
    IconFileText,
    IconGift,
    IconHash,
    IconHeart,
    IconKey,
    IconLifebuoy,
    IconMessage,
    IconPencil,
    IconPhoto,
    IconPlayerPlay,
    IconShare,
    IconTag,
    IconUpload,
    IconUsers,
    IconVideo,
    IconWebhook,
} from '@tabler/icons-vue';
import { computed, toRaw, type Component, type HTMLAttributes } from 'vue';

import IntegrationIcon from '@/components/IntegrationIcon.vue';
import type { IconTone } from '@/lib/iconTones';

const props = withDefaults(
    defineProps<{
        icon: Component;
        tile?: boolean;
        class?: HTMLAttributes['class'];
    }>(),
    { tile: true },
);

// Component identity keeps an action's tone stable across navigation and content.
const tones = new Map<Component, IconTone>([
    [IconCloudUpload, 'blue'],
    [IconUpload, 'blue'],
    [IconPhoto, 'rose'],
    [IconVideo, 'rose'],
    [IconPlayerPlay, 'rose'],
    [IconTag, 'amber'],
    [IconCalendar, 'plum'],
    [IconClock, 'amber'],
    [IconChartBar, 'blue'],
    [IconBolt, 'amber'],
    [IconFileText, 'plum'],
    [IconFileCheck, 'green'],
    [IconPencil, 'rose'],
    [IconAffiliate, 'cyan'],
    [IconHash, 'plum'],
    [IconWebhook, 'blue'],
    [IconGift, 'rose'],
    [IconLifebuoy, 'cyan'],
    [IconBrandDiscord, 'indigo'],
    [IconKey, 'amber'],
    [IconUsers, 'cyan'],
    [IconBell, 'amber'],
    [IconHeart, 'rose'],
    [IconMessage, 'blue'],
    [IconShare, 'green'],
]);
const tone = computed(() => tones.get(toRaw(props.icon)) ?? 'plum');
</script>

<template>
    <IntegrationIcon
        :tone="tone"
        :tile="tile"
        :class="props.class"
        aria-hidden="true"
    >
        <component
            :is="icon"
            class="size-full"
            stroke="1.65"
            focusable="false"
        />
    </IntegrationIcon>
</template>
