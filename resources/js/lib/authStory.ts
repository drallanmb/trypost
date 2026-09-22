import { reactive } from 'vue';

export const authFeatures = [
    'calendar',
    'scheduling',
    'media',
    'video',
    'team',
    'signatures',
] as const;
export type AuthFeature = (typeof authFeatures)[number];
export const storyDuration = 6500;

// One elapsed-time source drives both the scene and its progress segment.
export function createStoryPlayback(count: number, duration = storyDuration) {
    const state = reactive({ index: 0, elapsed: 0 });
    return {
        state,
        advance(milliseconds: number, paused: boolean) {
            if (paused || milliseconds <= 0) return;
            state.elapsed += milliseconds;
            if (state.elapsed >= duration) {
                state.index = (state.index + 1) % count;
                state.elapsed = 0;
            }
        },
        select(index: number) {
            if (!Number.isInteger(index) || index < 0 || index >= count) return;
            state.index = index;
            state.elapsed = 0;
        },
    };
}
