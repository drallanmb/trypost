<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { IconListCheck } from '@tabler/icons-vue';
import { computed } from 'vue';

import { useActiveUrl } from '@/composables/useActiveUrl';
import { useOnboardingLiveReload } from '@/composables/useOnboardingLiveReload';
import { onboarding } from '@/routes/app';
import type { OnboardingProgress } from '@/types';

const page = usePage();
const { urlIsActive } = useActiveUrl();

const onboardingProgress = computed<OnboardingProgress | false | undefined>(
    () => page.props.onboardingProgress,
);

const progressPercent = computed(() => {
    if (!onboardingProgress.value) {
        return 0;
    }

    const { completed, total } = onboardingProgress.value;

    return total > 0 ? Math.round((completed / total) * 100) : 0;
});

const liveEnabled = computed(
    () =>
        Boolean(onboardingProgress.value) &&
        page.component !== 'onboarding/Index',
);

useOnboardingLiveReload({
    only: ['onboardingProgress'],
    enabled: liveEnabled,
});
</script>

<template>
    <div
        v-if="onboardingProgress"
        class="px-1 pb-1 group-data-[collapsible=icon]:hidden"
    >
        <Link
            :href="onboarding.url()"
            data-testid="sidebar-onboarding"
            :class="[
                'block rounded-2xl border border-border p-3 transition-colors',
                urlIsActive(onboarding.url())
                    ? 'bg-sidebar-accent'
                    : 'bg-sidebar-accent/40 hover:bg-sidebar-accent',
            ]"
        >
            <div class="flex items-start gap-2">
                <span
                    class="inline-flex size-7 shrink-0 items-center justify-center rounded-xl bg-card/70"
                >
                    <IconListCheck
                        class="size-4 text-brand-plum"
                        stroke-width="1.5"
                    />
                </span>
                <div class="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div class="flex items-baseline justify-between gap-2">
                        <p
                            class="min-w-0 truncate text-sm leading-tight font-medium text-foreground"
                        >
                            {{ $t('sidebar.onboarding') }}
                        </p>
                        <span
                            class="shrink-0 rounded-full bg-card/70 px-1.5 py-px text-[10px] leading-none font-medium tabular-nums"
                        >
                            {{ onboardingProgress.completed }}/{{
                                onboardingProgress.total
                            }}
                        </span>
                    </div>
                    <p class="text-xs leading-snug text-muted-foreground">
                        {{ $t('sidebar.onboarding_hint') }}
                    </p>
                </div>
            </div>
            <div
                class="mt-2.5 h-1.5 overflow-hidden rounded-full bg-card"
                role="progressbar"
                :aria-label="$t('sidebar.onboarding')"
                :aria-valuenow="onboardingProgress.completed"
                :aria-valuemin="0"
                :aria-valuemax="onboardingProgress.total"
            >
                <div
                    class="h-full rounded-full bg-brand-plum transition-[width]"
                    :style="{ width: `${progressPercent}%` }"
                />
            </div>
        </Link>
    </div>
</template>
