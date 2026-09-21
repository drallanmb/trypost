import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { createServer } from 'vite';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

test('the real brand and theme components render accessible names and non-submitting controls', async () => {
    const server = await createServer({
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
        const toggle = await renderToString(createSSRApp(ThemeToggle));
        assert.match(toggle, /type="button"/);
        assert.match(toggle, /aria-label="Solar → Afterglow"/);
        assert.match(toggle, /aria-pressed="false"/);
        assert.match(toggle, />Solar</);
    } finally {
        await server.close();
    }
});
