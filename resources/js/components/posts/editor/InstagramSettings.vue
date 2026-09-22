<script setup lang="ts">
import {
    IconAlertTriangle,
    IconChevronDown,
    IconChevronUp,
} from '@tabler/icons-vue';
import { computed, ref, watch } from 'vue';

import PlatformIcon from '@/components/PlatformIcon.vue';
import { Avatar } from '@/components/ui/avatar';
import { getMediaValidationWarning } from '@/composables/useMedia';
import {
    fallbackImageCapableVariant,
    filterImageCapableVariants,
} from '@/lib/aiGenerateVariants';
import { ContentType } from '@/types/content-type';
import type { MediaItem } from '@/types/media';

interface SocialAccount {
    id: string;
    platform: string;
    display_name: string;
    username: string;
    display_label: string;
    avatar_url: string | null;
}

interface Props {
    socialAccount: SocialAccount | null;
    contentType: string;
    media: MediaItem[];
    meta?: Record<string, any>;
    disabled?: boolean;
    previewOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    meta: () => ({}),
    previewOnly: false,
});

const emit = defineEmits<{
    'update:contentType': [value: string];
    'update:meta': [meta: Record<string, any>];
}>();

const open = ref(false);

const allVariants = [
    {
        value: ContentType.InstagramFeed,
        labelKey: 'posts.form.instagram.variant.feed',
    },
    {
        value: ContentType.InstagramReel,
        labelKey: 'posts.form.instagram.variant.reel',
    },
    {
        value: ContentType.InstagramStory,
        labelKey: 'posts.form.instagram.variant.story',
    },
] as const;

const variants = computed(() =>
    filterImageCapableVariants(allVariants, props.previewOnly),
);

watch(
    () => [props.previewOnly, props.contentType, variants.value] as const,
    () => {
        const fallback = fallbackImageCapableVariant(
            props.contentType,
            variants.value,
        );
        if (fallback) {
            emit('update:contentType', fallback);
        }
    },
    { immediate: true },
);

const aspectRatios = [
    { value: '1:1', labelKey: 'posts.form.instagram.aspect.square' },
    { value: '4:5', labelKey: 'posts.form.instagram.aspect.portrait' },
    { value: '16:9', labelKey: 'posts.form.instagram.aspect.landscape' },
    { value: 'original', labelKey: 'posts.form.instagram.aspect.original' },
];

const isFeed = computed(() => props.contentType === ContentType.InstagramFeed);
const selectedAspectRatio = computed(() => props.meta.aspect_ratio ?? '1:1');

const pickVariant = (value: string) => {
    if (props.disabled) return;
    emit('update:contentType', value);
};

const pickAspectRatio = (value: string) => {
    if (props.disabled) return;
    emit('update:meta', { ...props.meta, aspect_ratio: value });
};

const warning = computed(() =>
    getMediaValidationWarning(props.contentType, props.media),
);
</script>

<template>
    <div class="rounded-2xl border border-border bg-card shadow-2xs">
        <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-sm"
            @click="open = !open"
        >
            <span class="flex min-w-0 items-center gap-2">
                <span
                    class="inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card"
                >
                    <PlatformIcon
                        :platform="socialAccount?.platform ?? 'instagram'"
                        class="size-full p-0.5"
                    />
                </span>
                <span class="truncate font-bold text-foreground">{{
                    $t('posts.form.instagram.settings')
                }}</span>
                <span
                    v-if="socialAccount?.username"
                    class="truncate font-medium text-foreground/60"
                    >·&nbsp;@{{ socialAccount.username }}</span
                >
            </span>
            <IconChevronUp
                v-if="open"
                class="size-4 shrink-0 text-foreground/60"
            />
            <IconChevronDown
                v-else
                class="size-4 shrink-0 text-foreground/60"
            />
        </button>

        <div
            v-if="open"
            class="space-y-5 border-t border-border px-4 pt-4 pb-4"
        >
            <div
                v-if="socialAccount"
                class="flex items-center gap-3 rounded-lg bg-foreground/5 p-3"
            >
                <Avatar
                    :src="socialAccount.avatar_url"
                    :name="socialAccount.display_label"
                    class="size-9 shrink-0 rounded-full border border-border shadow-2xs"
                />
                <div class="min-w-0 flex-1">
                    <p
                        class="text-[11px] font-black tracking-widest text-foreground/60 uppercase"
                    >
                        {{ $t('posts.form.instagram.posting_to') }}
                    </p>
                    <p class="truncate text-sm">
                        <span class="font-bold text-foreground">{{
                            socialAccount.display_label
                        }}</span>
                        <span
                            v-if="socialAccount?.username"
                            class="font-medium text-foreground/60"
                            >&nbsp;@{{ socialAccount.username }}</span
                        >
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <p
                    class="text-[11px] font-black tracking-widest text-foreground/60 uppercase"
                >
                    {{ $t('posts.form.instagram.variant_label') }}
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="variant in variants"
                        :key="variant.value"
                        type="button"
                        class="cursor-pointer rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        :class="
                            contentType === variant.value
                                ? 'border-ring bg-accent text-foreground shadow-2xs ring-1 ring-ring'
                                : 'border-border text-foreground/70 hover:border-ring hover:text-foreground'
                        "
                        :disabled="disabled"
                        @click="pickVariant(variant.value)"
                    >
                        {{ $t(variant.labelKey) }}
                    </button>
                </div>
            </div>

            <div v-if="isFeed" class="space-y-2">
                <p
                    class="text-[11px] font-black tracking-widest text-foreground/60 uppercase"
                >
                    {{ $t('posts.form.instagram.aspect_label') }}
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="ratio in aspectRatios"
                        :key="ratio.value"
                        type="button"
                        class="cursor-pointer rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        :class="
                            selectedAspectRatio === ratio.value
                                ? 'border-ring bg-accent text-foreground shadow-2xs ring-1 ring-ring'
                                : 'border-border text-foreground/70 hover:border-border hover:text-foreground'
                        "
                        :disabled="disabled"
                        @click="pickAspectRatio(ratio.value)"
                    >
                        {{ $t(ratio.labelKey) }}
                    </button>
                </div>
            </div>

            <p
                v-if="warning && !previewOnly"
                class="flex items-start gap-2 rounded-lg border border-border bg-rose-50 p-2 text-xs font-semibold text-rose-700"
            >
                <IconAlertTriangle class="mt-0.5 size-3.5 shrink-0" />
                {{ $t(`posts.form.warnings.${warning.key}`, warning.params) }}
            </p>
        </div>
    </div>
</template>
