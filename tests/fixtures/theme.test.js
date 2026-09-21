import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const key = 'social-anamnesismd.theme';
const blade = await readFile(
    new URL('../../resources/views/app.blade.php', import.meta.url),
    'utf8',
);

function browser(value, blocked = false) {
    const stored = new Map(value === null ? [] : [[key, value]]);
    return {
        document: { documentElement: { dataset: {}, style: {} } },
        get localStorage() {
            if (blocked) throw new Error('Storage blocked');
            return {
                getItem: (name) => stored.get(name) ?? null,
                setItem: (name, next) => stored.set(name, next),
            };
        },
        stored,
    };
}

test('the pre-paint script applies only a valid saved theme and survives blocked storage', () => {
    const script = blade.match(
        /<script data-theme-init>([\s\S]*?)<\/script>/,
    )?.[1];
    assert.ok(script, 'A synchronous theme initializer must precede the app');
    for (const [saved, blocked, expected] of [
        [null, false, 'solar'],
        ['invalid', false, 'solar'],
        ['afterglow', false, 'afterglow'],
        ['afterglow', true, 'solar'],
    ]) {
        const context = browser(saved, blocked);
        runInNewContext(script, context);
        assert.equal(context.document.documentElement.dataset.theme, expected);
        assert.equal(
            context.document.documentElement.style.colorScheme,
            expected === 'afterglow' ? 'dark' : 'light',
        );
    }
});

test('theme switching updates the document and persists the selected value', async () => {
    const { initializeTheme, setTheme } =
        await import('../../resources/js/lib/theme.ts');
    const context = browser(null);
    assert.equal(initializeTheme(context), 'solar');
    assert.equal(setTheme('afterglow', context), 'afterglow');
    assert.equal(context.document.documentElement.dataset.theme, 'afterglow');
    assert.equal(context.stored.get(key), 'afterglow');
    assert.equal(initializeTheme(context), 'afterglow');
    setTheme('solar', context);
    assert.equal(context.document.documentElement.dataset.theme, 'solar');
    assert.equal(context.stored.get(key), 'solar');
});

test('invalid, unavailable, and blocked storage default to Solar but allow in-memory switching', async () => {
    const { initializeTheme, setTheme } =
        await import('../../resources/js/lib/theme.ts');
    assert.equal(initializeTheme(), 'solar');
    for (const context of [
        browser('dark'),
        browser(null),
        browser('afterglow', true),
    ]) {
        assert.equal(initializeTheme(context), 'solar');
        assert.equal(setTheme('afterglow', context), 'afterglow');
        assert.equal(
            context.document.documentElement.dataset.theme,
            'afterglow',
        );
    }
    const context = browser('afterglow');
    setTheme('invalid', context);
    assert.equal(context.document.documentElement.dataset.theme, 'solar');
});

test('both themes expose the approved semantic colors and accessible action foregrounds', async () => {
    const css = await readFile(
        new URL('../../resources/css/app.css', import.meta.url),
        'utf8',
    );
    const palettes = [
        [
            ':root',
            {
                background: '#f5f1f7',
                secondary: '#eee8f2',
                card: '#ffffff',
                foreground: '#302c38',
                'muted-foreground': '#716a7a',
                primary: '#ed5f7a',
                'brand-plum': '#68479b',
                'brand-yellow': '#f5c84c',
                border: 'rgba(80, 58, 92, 0.13)',
                success: '#2f7d65',
                destructive: '#c64a5a',
            },
        ],
        [
            "[data-theme='afterglow']",
            {
                background: '#17121d',
                secondary: '#211824',
                card: '#2b2131',
                foreground: '#fbf7f0',
                'muted-foreground': '#bcb2c1',
                primary: '#f05f9b',
                'brand-plum': '#9a6cff',
                'brand-yellow': '#f7b64d',
                border: 'rgba(255, 255, 255, 0.11)',
                success: '#68c9a1',
                destructive: '#ff7d8f',
            },
        ],
    ];
    for (const [selector, expected] of palettes) {
        const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
        const values = Object.fromEntries(
            [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
                match[1],
                match[2].trim(),
            ]),
        );
        for (const [token, color] of Object.entries(expected))
            assert.equal(values[token], color, `${selector} --${token}`);
        assert.ok(
            contrast(values.primary, values['primary-foreground']) >= 4.5,
        );
        assert.ok(
            contrast(values.destructive, values['destructive-foreground']) >=
                4.5,
        );
        assert.ok(contrast(values.foreground, values.card) >= 4.5);
        assert.ok(
            contrast(values['muted-foreground'], values.background) >= 4.5,
        );
        for (const status of ['success', 'warning']) {
            assert.ok(
                values[`${status}-foreground`],
                `${selector} must define a ${status} foreground`,
            );
            assert.ok(
                contrast(values[status], values[`${status}-foreground`]) >= 4.5,
                `${selector} ${status} contrast`,
            );
        }
    }
});

function contrast(first, second) {
    const luminance = (color) =>
        color
            .match(/[a-f\d]{2}/gi)
            .map((part) => parseInt(part, 16) / 255)
            .map((value) =>
                value <= 0.04045
                    ? value / 12.92
                    : ((value + 0.055) / 1.055) ** 2.4,
            )
            .reduce(
                (sum, value, index) =>
                    sum + value * [0.2126, 0.7152, 0.0722][index],
                0,
            );
    const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
}
