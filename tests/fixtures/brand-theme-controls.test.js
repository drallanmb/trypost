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
