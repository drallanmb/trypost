<script setup lang="ts">
import PlatformIcon from '@/components/PlatformIcon.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Platform } from '@/types/platform';

const open = defineModel<boolean>('open', { required: true });

const props = withDefaults(
    defineProps<{
        methods?: string[];
    }>(),
    {
        methods: () => [Platform.Instagram, Platform.InstagramFacebook],
    },
);

const emit = defineEmits<{
    select: [method: string];
}>();

const choose = (method: string) => {
    open.value = false;
    emit('select', method);
};

const showsStandalone = () => props.methods.includes(Platform.Instagram);
const showsFacebook = () => props.methods.includes(Platform.InstagramFacebook);
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent
            class="sm:max-w-md"
            data-testid="instagram-connect-dialog"
        >
            <DialogHeader>
                <div class="flex items-start gap-3">
                    <PlatformIcon platform="instagram" class="size-10 p-1" />
                    <div class="text-left">
                        <DialogTitle>{{
                            $t('accounts.instagram_connect.title')
                        }}</DialogTitle>
                        <DialogDescription>{{
                            $t('accounts.instagram_connect.description')
                        }}</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div class="grid gap-3 py-2">
                <Button
                    v-if="showsStandalone()"
                    variant="outline"
                    class="h-auto justify-start gap-3 px-4 py-3 text-left whitespace-normal"
                    data-testid="instagram-connect-standalone"
                    @click="choose(Platform.Instagram)"
                >
                    <span
                        class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground"
                    >
                        <PlatformIcon
                            platform="instagram"
                            decorative
                            class="size-5"
                        />
                    </span>
                    <span class="min-w-0 flex-1">
                        <span
                            class="block text-sm font-semibold text-foreground"
                            >{{
                                $t(
                                    'accounts.instagram_connect.standalone_title',
                                )
                            }}</span
                        >
                        <span
                            class="mt-0.5 block text-xs font-normal text-muted-foreground"
                            >{{
                                $t(
                                    'accounts.instagram_connect.standalone_description',
                                )
                            }}</span
                        >
                    </span>
                </Button>

                <Button
                    v-if="showsFacebook()"
                    variant="outline"
                    class="h-auto justify-start gap-3 px-4 py-3 text-left whitespace-normal"
                    data-testid="instagram-connect-facebook"
                    @click="choose(Platform.InstagramFacebook)"
                >
                    <span
                        class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground"
                    >
                        <PlatformIcon
                            platform="facebook"
                            decorative
                            class="size-5"
                        />
                    </span>
                    <span class="min-w-0 flex-1">
                        <span
                            class="block text-sm font-semibold text-foreground"
                            >{{
                                $t('accounts.instagram_connect.facebook_title')
                            }}</span
                        >
                        <span
                            class="mt-0.5 block text-xs font-normal text-muted-foreground"
                            >{{
                                $t(
                                    'accounts.instagram_connect.facebook_description',
                                )
                            }}</span
                        >
                    </span>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>
