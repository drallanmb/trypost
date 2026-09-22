import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { createServer } from 'vite';
import { createSSRApp, defineComponent, h, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';

function createComponentServer() {
    return createServer({
        configFile: false,
        plugins: [vue()],
        optimizeDeps: { noDiscovery: true },
        resolve: {
            alias: {
                '@': fileURLToPath(
                    new URL('../../resources/js', import.meta.url),
                ),
            },
        },
        server: { middlewareMode: true, watch: null },
    });
}

test('platform icons resolve every network and account alias to its own monochrome SVG', async () => {
    const server = await createComponentServer();
    try {
        const { default: PlatformIcon } = await server.ssrLoadModule(
            '/resources/js/components/PlatformIcon.vue',
        );
        const cases = [
            ['instagram', 'instagram', 'Instagram'],
            ['instagram-facebook', 'instagram', 'Instagram'],
            ['facebook', 'facebook', 'Facebook'],
            ['linkedin', 'linkedin', 'LinkedIn'],
            ['linkedin-page', 'linkedin', 'LinkedIn Page'],
            ['x', 'x', 'X'],
            ['tiktok', 'tiktok', 'TikTok'],
            ['youtube', 'youtube', 'YouTube'],
            ['threads', 'threads', 'Threads'],
            ['bluesky', 'bluesky', 'Bluesky'],
            ['pinterest', 'pinterest', 'Pinterest'],
            ['mastodon', 'mastodon', 'Mastodon'],
            ['telegram', 'telegram', 'Telegram'],
            ['discord', 'discord', 'Discord'],
        ];
        for (const [platform, glyph, label] of cases) {
            const html = await renderToString(createSSRApp(PlatformIcon, { platform }));
            assert.ok(html.includes(`tabler-icon-brand-${glyph}`), platform);
            assert.ok(html.includes(`aria-label="${label}"`), platform);
            assert.match(html, /role="img"/);
            assert.match(html, /stroke="currentColor"/);
            assert.match(html, /viewBox="0 0 24 24"/);
            assert.doesNotMatch(html, /<img|<image|stroke="#/);
        }
    } finally {
        await server.close();
    }
});

test('platform icons hide decorative duplicates and never misidentify an unknown network', async () => {
    const server = await createComponentServer();
    try {
        const { default: PlatformIcon } = await server.ssrLoadModule(
            '/resources/js/components/PlatformIcon.vue',
        );
        const decorative = await renderToString(createSSRApp(PlatformIcon, {
            platform: 'instagram', decorative: true, class: 'size-8 text-background',
        }));
        assert.match(decorative, /aria-hidden="true"/);
        assert.doesNotMatch(decorative, /aria-label=|role="img"/);
        assert.match(decorative, /size-8/);
        assert.doesNotMatch(decorative, /size-5/);
        assert.match(decorative, /text-background/);
        assert.doesNotMatch(decorative, /text-foreground/);
        for (const platform of ['future-network', 'constructor', '']) {
            const html = await renderToString(createSSRApp(PlatformIcon, {
                platform, label: 'Network account',
            }));
            assert.match(html, /tabler-icon-world/);
            assert.match(html, /aria-label="Network account"/);
            assert.doesNotMatch(html, /tabler-icon-brand-/);
        }
    } finally {
        await server.close();
    }
});

test('the calendar empty state offers the selected-date creation link only to authors', async () => {
    const server = await createComponentServer();
    try {
        const { default: EmptyState } = await server.ssrLoadModule(
            '/resources/js/components/calendar/CalendarEmptyState.vue',
        );
        const render = async (canCreate) => {
            const app = createSSRApp(EmptyState, {
                canCreate,
                createUrl: '/posts/create?date=2026-09-21',
            });
            app.config.globalProperties.$t = (key) => key;
            return renderToString(app);
        };
        const author = await render(true);
        assert.match(author, /<h2[^>]*>posts.no_posts<\/h2>/);
        assert.match(author, /href="\/posts\/create\?date=2026-09-21"/);
        assert.match(author, /posts.start_creating/);
        const reader = await render(false);
        assert.match(reader, /posts.no_posts/);
        assert.doesNotMatch(reader, /href=|posts.start_creating/);
    } finally {
        await server.close();
    }
});

test('the real brand and theme components render accessible names and non-submitting controls', async () => {
    const server = await createComponentServer();
    try {
        const { default: ProductBrand } = await server.ssrLoadModule(
            '/resources/js/components/brand/ProductBrand.vue',
        );
        const { default: ThemeToggle } = await server.ssrLoadModule(
            '/resources/js/components/ThemeToggle.vue',
        );
        const brand = await renderToString(createSSRApp(ProductBrand));
        assert.match(brand, /Social AnamnesisMD/);
        const compact = await renderToString(
            createSSRApp(ProductBrand, { compact: true }),
        );
        assert.match(compact, /aria-label="Social AnamnesisMD"/);
        assert.match(compact, /role="img"/);
        const toggle = await renderToString(createSSRApp(ThemeToggle));
        assert.match(toggle, /type="button"/);
        assert.match(toggle, /aria-label="Solar → Afterglow"/);
        assert.match(toggle, /aria-pressed="false"/);
        assert.match(toggle, />Solar</);
    } finally {
        await server.close();
    }
});

test('status badges render paired semantic background and foreground colors', async () => {
    const server = await createComponentServer();
    try {
        const { default: Badge } = await server.ssrLoadModule(
            '/resources/js/components/ui/badge/Badge.vue',
        );
        for (const variant of ['destructive', 'success', 'warning']) {
            const rendered = await renderToString(
                createSSRApp(Badge, { variant }),
            );
            assert.ok(
                rendered.includes(`bg-${variant} `),
                `${variant} background must use its semantic color`,
            );
            assert.ok(
                rendered.includes(`text-${variant}-foreground`),
                `${variant} foreground must follow the selected theme`,
            );
        }
    } finally {
        await server.close();
    }
});

test('the header exposes its working sidebar trigger only on mobile', async () => {
    const server = await createComponentServer();
    try {
        const { default: Header } = await server.ssrLoadModule(
            '/resources/js/components/AppHeader.vue',
        );
        const { provideSidebarContext } = await server.ssrLoadModule(
            '/resources/js/components/ui/sidebar/utils.ts',
        );
        const renderHeader = async (mobile) =>
            renderToString(
                createSSRApp(
                    defineComponent({
                        setup() {
                            provideSidebarContext({
                                state: ref('expanded'),
                                open: ref(true),
                                openMobile: ref(false),
                                isMobile: ref(mobile),
                                setOpen() {},
                                setOpenMobile() {},
                                toggleSidebar() {},
                            });
                            return () => h(Header);
                        },
                    }),
                ),
            );
        const desktop = await renderHeader(false);
        assert.doesNotMatch(desktop, /data-slot="sidebar-trigger"/);
        assert.match(desktop, /data-testid="theme-toggle"/);
        const mobile = await renderHeader(true);
        assert.match(mobile, /data-slot="sidebar-trigger"/);
        assert.match(mobile, /aria-label="Social AnamnesisMD"/);
        assert.match(mobile, /role="img"/);
    } finally {
        await server.close();
    }
});
