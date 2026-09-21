<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ $htmlDir ?? 'ltr' }}" data-theme="solar">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <script data-theme-init>
            (function () {
                var theme = 'solar';
                try {
                    if (localStorage.getItem('social-anamnesismd.theme') === 'afterglow') theme = 'afterglow';
                } catch (_) {}
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme === 'afterglow' ? 'dark' : 'light';
            })();
        </script>

        @include('partials.gtm')

        {{-- Inline page-paint background. Matches `--background` so the
             first paint doesn't flash white before CSS loads. --}}
        <style>
            html {
                background-color: #f5f1f7;
            }
            html[data-theme='afterglow'] {
                background-color: #17121d;
            }
        </style>

        <title data-inertia>Social AnamnesisMD</title>

        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <!-- Orbit-aligned UI typography; preserve fonts used by existing content previews. -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

        @vite(['resources/js/app.ts'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @include('partials.gtm-noscript')
        @inertia
    </body>
</html>
