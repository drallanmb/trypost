<script setup lang="ts">
import {
    IconCalendar,
    IconCheck,
    IconClock,
    IconHash,
    IconLink,
    IconPhoto,
    IconPlayerPlay,
    IconUpload,
    IconUsers,
    IconVideo,
} from '@tabler/icons-vue';
import { trans } from 'laravel-vue-i18n';

import AppIcon from '@/components/AppIcon.vue';
import PlatformIcon from '@/components/PlatformIcon.vue';
import type { AuthFeature } from '@/lib/authStory';

defineProps<{ feature: AuthFeature }>();
const icons = {
    calendar: IconCalendar,
    scheduling: IconClock,
    media: IconPhoto,
    video: IconVideo,
    team: IconUsers,
    signatures: IconHash,
};
const networks = ['instagram', 'linkedin', 'youtube'];
</script>

<template>
    <!-- Illustrative UI only: no customer data, controls or publishing activity. -->
    <div class="feature-scene" :data-feature="feature" aria-hidden="true">
        <div class="scene-sidebar">
            <span class="scene-brand-dot" />
            <AppIcon
                v-for="(icon, key) in icons"
                :key="key"
                :icon="icon"
                class="size-7 rounded-lg p-1.5"
                :class="key !== feature && 'opacity-45'"
            />
        </div>
        <div class="scene-workspace">
            <div class="scene-toolbar">
                <span>{{ trans(`auth.slides.${feature}.title`) }}</span>
                <AppIcon
                    :icon="icons[feature]"
                    class="size-7 rounded-lg p-1.5"
                />
            </div>

            <div v-if="feature === 'calendar'" class="scene-calendar">
                <div v-for="day in 28" :key="day" class="calendar-day">
                    <span>{{ day }}</span>
                    <div
                        v-if="[3, 8, 12, 16, 19, 24].includes(day)"
                        class="calendar-post"
                        :class="`tone-${day % 3}`"
                    >
                        <PlatformIcon
                            :platform="networks[day % 3]"
                            class="size-3.5"
                        />
                        <i class="scene-line" />
                    </div>
                </div>
            </div>

            <div v-else-if="feature === 'scheduling'" class="scene-scheduling">
                <div
                    v-for="(network, index) in networks"
                    :key="network"
                    class="queue-row"
                >
                    <span class="queue-time">{{
                        ['09:00', '12:30', '18:00'][index]
                    }}</span>
                    <div class="queue-post">
                        <span class="mini-art" :class="`tone-${index}`"
                            ><IconPhoto class="size-5"
                        /></span>
                        <div class="scene-lines">
                            <i class="scene-line" /><i
                                class="scene-line short"
                            />
                        </div>
                        <PlatformIcon :platform="network" class="size-5" />
                        <IconCheck class="size-4 text-success" />
                    </div>
                </div>
                <div class="queue-track"><span /><span /><span /></div>
            </div>

            <div v-else-if="feature === 'media'" class="scene-media">
                <div
                    v-for="tile in 6"
                    :key="tile"
                    class="media-tile"
                    :class="`tone-${tile % 3}`"
                >
                    <div class="art-circle" />
                    <div class="art-hill" />
                    <IconPlayerPlay
                        v-if="tile === 3"
                        class="media-glyph size-6"
                    />
                    <IconPhoto v-else class="media-glyph size-5" />
                    <span class="media-index">0{{ tile }}</span>
                </div>
                <div class="media-upload">
                    <AppIcon
                        :icon="IconUpload"
                        class="size-6 rounded-md p-1"
                    /><span class="scene-line" /><IconCheck
                        class="size-4 text-success"
                    />
                </div>
            </div>

            <div v-else-if="feature === 'video'" class="scene-video">
                <div class="video-frame tone-0">
                    <div class="art-circle" />
                    <div class="art-hill" />
                    <span class="video-play"
                        ><IconPlayerPlay class="size-6"
                    /></span>
                    <div class="video-caption"><i /><i /></div>
                </div>
                <div class="video-details">
                    <div class="scene-lines">
                        <i class="scene-line" /><i class="scene-line short" />
                    </div>
                    <div class="video-networks">
                        <PlatformIcon
                            v-for="network in [
                                'instagram',
                                'tiktok',
                                'youtube',
                            ]"
                            :key="network"
                            :platform="network"
                            class="size-9 rounded-xl border border-border bg-card p-2"
                        />
                    </div>
                    <div class="video-timeline">
                        <span
                            v-for="bar in 18"
                            :key="bar"
                            :style="{ height: `${12 + ((bar * 7) % 24)}px` }"
                        />
                    </div>
                    <div class="video-time">
                        <span>00:12</span><span>00:30</span>
                    </div>
                </div>
            </div>

            <div v-else-if="feature === 'team'" class="scene-team">
                <div class="team-network">
                    <div class="team-connector" />
                    <AppIcon
                        :icon="IconUsers"
                        class="relative size-14 rounded-2xl p-3"
                    />
                    <div class="team-avatars">
                        <span
                            v-for="member in 3"
                            :key="member"
                            class="team-avatar"
                            :class="`tone-${member % 3}`"
                            ><IconUsers class="size-5" /><i
                        /></span>
                    </div>
                </div>
                <div class="team-rows">
                    <div
                        v-for="network in networks"
                        :key="network"
                        class="team-row"
                    >
                        <PlatformIcon :platform="network" class="size-5" /><span
                            class="scene-line"
                        /><IconCheck class="size-4 text-success" />
                    </div>
                </div>
            </div>

            <div v-else class="scene-signatures">
                <div class="signature-post">
                    <div class="signature-author">
                        <span class="team-avatar tone-1"
                            ><IconUsers class="size-4" /></span
                        ><span class="scene-line" /><PlatformIcon
                            platform="instagram"
                            class="size-5"
                        />
                    </div>
                    <div class="scene-lines">
                        <i class="scene-line" /><i class="scene-line" /><i
                            class="scene-line short"
                        />
                    </div>
                    <div class="signature-attached">
                        <IconHash class="size-4" /><span
                            class="scene-line"
                        /><IconCheck class="size-4" />
                    </div>
                </div>
                <div class="signature-library">
                    <AppIcon :icon="IconHash" class="size-9 rounded-xl p-2" />
                    <div class="scene-lines">
                        <i class="scene-line" /><i class="scene-line short" />
                    </div>
                    <IconLink class="size-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.feature-scene {
    display: flex;
    height: 292px;
    background: var(--card);
    color: var(--foreground);
}
.scene-sidebar {
    display: flex;
    width: 46px;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    padding: 15px 0;
    border-right: 1px solid var(--border);
    background: var(--background);
}
.scene-brand-dot {
    width: 15px;
    height: 15px;
    margin-bottom: 7px;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 5px 0 0 color-mix(in srgb, var(--brand-yellow) 60%, transparent);
}
.scene-workspace {
    flex: 1;
    min-width: 0;
    padding: 16px;
}
.scene-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 11px;
    font-weight: 600;
}
.scene-line {
    display: block;
    width: 100%;
    height: 5px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--muted-foreground) 20%, transparent);
}
.scene-line.short {
    width: 62%;
}
.scene-lines {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 9px;
}
.tone-0 {
    color: var(--integration-rose);
    background: var(--integration-rose-tint);
}
.tone-1 {
    color: var(--integration-plum);
    background: var(--integration-plum-tint);
}
.tone-2 {
    color: var(--integration-amber);
    background: var(--integration-amber-tint);
}
.scene-calendar {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    height: 210px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 12px;
}
.calendar-day {
    min-width: 0;
    padding: 5px 3px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    font-size: 8px;
    color: var(--muted-foreground);
}
.calendar-day:nth-child(7n) {
    border-right: 0;
}
.calendar-day:nth-child(n + 22) {
    border-bottom: 0;
}
.calendar-post {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 4px;
    padding: 4px;
    border-radius: 5px;
}
.calendar-post svg {
    flex-shrink: 0;
}
.calendar-post .scene-line {
    height: 3px;
    background: currentColor;
    opacity: 0.25;
}
.scene-scheduling {
    padding-top: 12px;
}
.queue-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 13px;
}
.queue-time {
    width: 34px;
    flex-shrink: 0;
    font-size: 9px;
    font-variant-numeric: tabular-nums;
    color: var(--muted-foreground);
}
.queue-post {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 3px 9px color-mix(in srgb, var(--foreground) 3%, transparent);
}
.mini-art {
    display: grid;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    place-items: center;
    border-radius: 8px;
}
.queue-track {
    display: flex;
    height: 3px;
    margin: 20px 15px 0 45px;
    justify-content: space-between;
    background: var(--border);
}
.queue-track span {
    width: 7px;
    height: 7px;
    margin-top: -2px;
    border-radius: 50%;
    background: var(--primary);
}
.scene-media {
    position: relative;
    display: grid;
    height: 210px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    padding-bottom: 26px;
}
.media-tile {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-radius: 11px;
}
.art-circle {
    position: absolute;
    width: 64%;
    aspect-ratio: 1;
    top: 12%;
    right: -8%;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.16;
}
.art-hill {
    position: absolute;
    width: 130%;
    height: 90%;
    bottom: -50%;
    left: -30%;
    border-radius: 45%;
    transform: rotate(-25deg);
    background: currentColor;
    opacity: 0.18;
}
.media-glyph {
    position: absolute;
    top: 12px;
    left: 12px;
}
.media-index {
    position: absolute;
    right: 9px;
    bottom: 7px;
    font-size: 8px;
    letter-spacing: 0.1em;
}
.media-upload {
    position: absolute;
    bottom: 0;
    right: 13px;
    left: 13px;
    display: flex;
    gap: 10px;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    padding: 7px 10px;
    box-shadow: 0 6px 18px color-mix(in srgb, var(--foreground) 7%, transparent);
}
.media-upload .scene-line {
    flex: 1;
}
.scene-video {
    display: flex;
    height: 210px;
    gap: 20px;
}
.video-frame {
    position: relative;
    overflow: hidden;
    width: 118px;
    flex-shrink: 0;
    border-radius: 18px;
    border: 4px solid var(--border);
}
.video-play {
    position: absolute;
    display: grid;
    place-items: center;
    top: 40%;
    left: 32%;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--card);
}
.video-caption {
    position: absolute;
    bottom: 24px;
    left: 16px;
    right: 16px;
}
.video-caption i {
    display: block;
    height: 5px;
    margin-top: 6px;
    background: currentColor;
    opacity: 0.4;
    border-radius: 4px;
}
.video-caption i:last-child {
    width: 60%;
}
.video-details {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: 19px;
    padding: 18px 0;
}
.video-details .scene-lines {
    flex: 0;
}
.video-networks {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}
.video-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    gap: 3px;
}
.video-timeline span {
    width: 4px;
    border-radius: 4px;
    background: var(--integration-rose);
    opacity: 0.45;
}
.video-time {
    display: flex;
    justify-content: space-between;
    margin-top: -14px;
    font-size: 8px;
    color: var(--muted-foreground);
}
.scene-team {
    display: flex;
    align-items: center;
    gap: 20px;
    height: 210px;
}
.team-network {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 35px;
}
.team-connector {
    position: absolute;
    top: 42px;
    bottom: 16px;
    width: 70%;
    border: 1px solid var(--border);
    border-radius: 15px;
}
.team-avatars {
    position: relative;
    display: flex;
    gap: 9px;
}
.team-avatar {
    display: grid;
    position: relative;
    place-items: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
}
.team-avatar i {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 8px;
    height: 8px;
    background: var(--success);
    border: 2px solid var(--card);
    border-radius: 50%;
}
.team-rows {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 12px;
}
.team-row {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 13px 9px;
    border: 1px solid var(--border);
    border-radius: 10px;
}
.team-row .scene-line {
    flex: 1;
}
.scene-signatures {
    padding: 1px 10px;
}
.signature-post {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 13px;
}
.signature-author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}
.signature-author .scene-line {
    flex: 1;
    margin-right: 20px;
}
.signature-attached {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 12px;
    padding: 9px;
    border-radius: 7px;
    color: var(--integration-plum);
    background: var(--integration-plum-tint);
}
.signature-attached .scene-line {
    flex: 1;
    background: currentColor;
    opacity: 0.25;
}
.signature-library {
    display: flex;
    align-items: center;
    gap: 11px;
    margin: 10px -6px 0;
    padding: 7px 13px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    box-shadow: 0 5px 16px color-mix(in srgb, var(--foreground) 5%, transparent);
}
.scene-signatures .scene-lines {
    gap: 6px;
}
</style>
