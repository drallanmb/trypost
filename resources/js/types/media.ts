import type { MediaType } from '@/lib/mediaType';
import type { JsonValue } from '@/types/json';

export type MediaSource = 'ai' | 'unsplash' | 'giphy';

export interface MediaItem {
    id: string;
    url: string;
    path?: string;
    type?: MediaType;
    mime_type?: string;
    original_filename?: string;
    size?: number;
    source?: MediaSource;
    source_meta?: Record<string, JsonValue> | null;
    meta?: {
        width?: number;
        height?: number;
        duration?: number;
        alt_text?: string;
    };
}
