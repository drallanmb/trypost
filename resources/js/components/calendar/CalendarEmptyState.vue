<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { IconCalendar, IconPlus } from '@tabler/icons-vue';

import { Button } from '@/components/ui/button';
defineProps<{ canCreate: boolean; createUrl: string }>();
</script>

<template>
    <div
        class="flex min-h-72 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
    >
        <div
            class="flex size-16 items-center justify-center rounded-3xl border border-border bg-secondary/50 text-brand-plum"
        >
            <IconCalendar
                class="size-7"
                stroke-width="1.5"
                aria-hidden="true"
            />
        </div>
        <div class="space-y-2">
            <h2 class="text-xl font-normal tracking-tight text-foreground">
                {{ $t('posts.no_posts') }}
            </h2>
            <p
                v-if="canCreate"
                class="max-w-xs text-sm leading-relaxed text-muted-foreground"
            >
                {{ $t('posts.start_creating') }}
            </p>
        </div>
        <Button v-if="canCreate" variant="outline" as-child class="mt-2">
            <Link :href="createUrl"
                ><IconPlus class="size-4" />{{ $t('calendar.new_post') }}</Link
            >
        </Button>
    </div>
</template>
