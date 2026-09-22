# Development Log

## 2026-09-22 — Login product scenes

- Replaced the isolated feature glyph in the authentication side panel with six decorative product scenes: calendar, scheduling queue, media library, video publishing, team workspaces and reusable signatures. Existing feature descriptions, form markup, authentication behavior, social glyphs, licenses and attribution remain unchanged.
- User-approved reference: [Orbit scene transitions](https://orbit-studio.humanagentlab3.chatgpt.site/catalogo), specifically the iris reveal, masked sequential typography and segmented story progress. Existing Social Solar/Afterglow tokens remain authoritative. Refero Dimension informed only restrained miniature product surfaces; the 21st search did not justify a new component or dependency.
- The Vue/CSS implementation uses a 700ms iris and staggered text entrance. A single 6.5-second scene clock drives advancement and progress. Hover, keyboard focus, explicit pause, hidden documents, mobile and reduced-motion preferences suspend playback; reduced motion also removes transitions. Illustrations contain no real customer data or interactive mock controls.
- Added localized pause/resume labels in all 16 UI catalogs. Added RED-first clock and SSR tests, then verified GREEN: `npm run check` passed all 25 frontend tests, type checking, ESLint and formatting. Independent review found no critical/important issues; signature spacing was tightened to keep its library row inside the scene stage. Browser and isolated-development build verification follow below.
- The initial isolated client/SSR build exited 0. PHP formatting passed for all 16 catalogs. Localization and authentication regressions passed **28 tests / 57 assertions** with explicit `APP_ENV=testing` and `DB_DATABASE=trypost_test`. The first test invocation inherited Compose's `APP_ENV=local` and failed five authentication assertions; selecting the test environment corrected the invocation without changing authentication code.
- Browser inspection confirmed the signatures library fits with 26px remaining inside the scene. Keyboard focus exposed a separate inherited overflow issue: the atmospheric blob made the hidden-overflow panel scroll internally by 128px. Replaced the outer panel's overflow with `clip` so focus cannot shift the composition; captured a failing regression assertion before the fix, then passed the full 25-test frontend check again.
- Final client/SSR build for `f8c10b63` exited 0 and development `/up` returned HTTP 200. Actual browser QA covered all six scenes, Solar/Afterglow, iris reveal, manual selection, auto-advance, stable explicit pause, and reduced motion (0s transitions and no auto-advance). The illustrative input remained intact through scene selection and was cleared without submitting. At 1024 × 701, signatures and navigation stay inside the panel; at 390 × 844, the decorative panel is hidden and document width equals scroll width in both themes. Final focus check reports `scrollTop: 0`; no console warnings/errors were captured.
- Restored the default viewport, Solar theme and normal motion preference, and left the login preview available. Production TryPost containers retained their healthy 13-day uptime; no production deployment, connection, publication or authentication change was performed.

## 2026-09-21 — Step 01: Fork and source baseline

- Created and verified the public fork `drallanmb/trypost`.
- Published product and implementation branches from v1.0.9 (`a932c51b`).
- Kept `main` synchronized with the upstream snapshot at `0b37f4dc`.
- Installed 671 JavaScript packages using the existing lockfile.
- Confirmed 54 Vue page components.
- Verified a clean working tree before product changes.
- Windows formatting check flagged 224 files; ESLint reported 200 import-order errors before PHP bootstrap and Wayfinder generation. These are baseline observations, not product regressions.
- PHP, Composer, and Docker were unavailable locally; WSL enumeration failed with a registration error.

## 2026-09-21 — Step 02: Isolated development runtime

### Decisions

- Use the existing VPS Docker engine with a separate development Compose project because local PHP/container runtimes are unavailable.
- Bind HTTP to loopback only; do not expose database ports or add a public domain.
- Use empty development databases and no production credentials.
- Start only PHP-FPM and nginx, with no scheduling or queue consumers.
- Track this directory explicitly; upstream ignores other `docs/` content.

### Changes

- Added `compose.social-dev.yaml` and `docker/social-dev-supervisord.conf`.
- Added environment instructions and this ongoing log.
- Read the pinned upstream `AGENTS.md`; its referenced `.ai/rules/index.md` is absent at v1.0.9. No application behavior has been changed.

### Verification

- VPS read-only preflight: Docker 29.7.2 and Compose v5.5.0; existing production containers healthy; adequate memory and disk available.
- Compose validation and image build succeeded; the isolated PostgreSQL and Redis services became healthy.
- Locked dependencies installed and development migrations completed. Composer platform requirements passed with PHP 8.4.25. The upstream Alpine dev image currently resolves Node 24.18.1 and npm 11.12.1.
- Authentication, workspace invite guards, and post controller baseline: **85 passed, 355 assertions**, 19.33 seconds (`--ci`, explicit test database overrides).
- Frontend build passed with Vite 8.0.16 in 25.58 seconds. Existing dependency annotation and large-chunk warnings remain.
- HTTP smoke test exposed a separate runtime failure: `/up` returned 500 (`curl --fail` exit 22), reporting `tempnam(): file created in the system's temporary directory`. FPM ran as UID 82, while runtime directories were UID 1000 with mode 755. CLI tests ran as root and therefore did not detect this mismatch.
- Added a development-only FPM pool override matching the entrypoint's UID-1000 `app` user. After recreation, the same `curl --fail` check passed (exit 0): `/up` and `/login` both returned HTTP 200. All three development containers became healthy.
- Browser smoke check: login form, translated English copy, legal links, and social-platform assets rendered. Captured browser warning/error log was empty. No account was created and no social platform was connected.
- Development application database still contains **0 users and 0 posts** after the test run, confirming the selected tests used the separate database.
- Existing `trypost-app-1`, `trypost-pgsql-1`, and `trypost-redis-1` remained healthy with 12 days of uptime. No production container was recreated.
- Remote application source working tree remained clean after bootstrap, build, and tests. Dependency lockfiles and upstream application files were not changed.

### Reproduce the targeted backend baseline

```sh
docker compose -f compose.social-dev.yaml exec -T \
  -e APP_ENV=testing -e DB_DATABASE=trypost_test \
  -e CACHE_STORE=array -e SESSION_DRIVER=array \
  -e QUEUE_CONNECTION=sync -e MAIL_MAILER=array \
  app php artisan test --compact --ci \
  tests/Feature/Auth/AuthenticationTest.php \
  tests/Feature/WorkspaceInviteGuardTest.php \
  tests/Feature/PostControllerTest.php
```

### Existing baseline failures and limitations

- `npx vue-tsc --noEmit`: exit 2, **8 diagnostics** across `PostPlatformMetrics.vue` (2), `useWebhookLogs.ts` (1), `automations/Form.vue` (2), `posts/Edit.vue` (2), and `welcome/Connect.vue` (1).
- `npx eslint .`: exit 1, **10 import-order errors** after Wayfinder generation. The earlier Windows run's 200 errors were observed before generated route helpers existed; this Linux result is the useful initialized baseline.
- `npm run format:check`: exit 1, **224 files** flagged, matching the earlier observation. No bulk formatting was applied.
- Composer emitted an existing PSR-4 warning for `TestPlatformException` in `tests/Unit/Exceptions/Social/SocialPublishExceptionTest.php`; platform compatibility still passed.
- The full PHP suite, MySQL compatibility, browser authentication flow, real social publishing, websocket behavior, scheduler, and queue processing were **not** verified in this increment.
- The app is development-only. Upstream branding and behavior remain. This is not a production rollout or completion of the product PRD.
- The browser preview requires an active SSH tunnel to loopback port 18081. Development accounts are separate from production accounts.

### Next increments

1. Triage the eight existing TypeScript diagnostics and establish focused regression checks before changing affected screens.
2. Implement the first branded slice: Social AnamnesisMD identity, Solar Social/Afterglow tokens, login, and authenticated shell, retaining platform assets and translations.
3. Implement Observer authorization and approval/archive behavior as separate tested backend increments. Resolve D-01 before implementing post-revision release behavior; do not silently weaken mandatory physician approval.

### Review and handoff

- Independent read-only review found no critical or high-severity isolation issues. It identified a cold-start race in the guide: plain `up -d` can return before dependency installation completes. The guide now waits for container health before invoking the first frontend build.
- The successful FPM HTTP smoke test supplies the readiness check for that wait. A complete fresh-volume second installation was not repeated.
- Configuration commits: `1e1bfbca` (isolated environment) and `735e028b` (development FPM ownership fix). Subsequent documentation commits record verification and review evidence.
- This increment delivers the private runtime, source-controlled configuration, operating guide, and baseline inventory. Product UI and approval features remain subsequent work.

## 2026-09-21 — Step 03: Frontend technical baseline

### Scope

- Resolve the eight initialized TypeScript diagnostics, then the import-order and formatting debt, before adding Solar Social/Afterglow.
- Keep dependency versions, server routes, database schema, publishing permissions, and existing visual identity unchanged.
- Use the existing type checker as the failing contract check; run affected backend regressions and the asset build after corrections.
- Keep semantic corrections separate from mechanical formatting in Git history.

### Investigation

- Fresh Docker reproduction returned TypeScript exit 2 with the same eight diagnostics recorded in Step 02.
- Confirmed installed Inertia 3.6.1: `reload()` always preserves scroll/state; its `ReloadOptions` deliberately excludes those overrides. Removed the redundant unsupported option without changing behavior. See [Inertia manual visits](https://inertiajs.com/docs/v3/the-basics/manual-visits).
- Tabler's exported Vue icon contract inherits SVG's string `stroke` attribute. Static `stroke="1.75"` preserves the emitted SVG value without a numeric type mismatch.
- Media source metadata is transported as JSON. Replaced `unknown` values with a recursive JSON value type, including nullable metadata supported by the backend; the gallery picker reuses the same metadata contract.
- The welcome form submits an empty payload but receives a server-level `connect` validation error. It now uses the existing page-error composable for that error instead of inventing a submitted field or bypassing type safety.
- Added non-mutating `typecheck`, `lint:check`, and combined `check` npm scripts. Generated Wayfinder helpers remain untracked build artifacts.
- Automation edges now retain their inferred serializable shape instead of widening their values to `unknown`. The Vue Flow registry adapts the same eight node components through a typed functional boundary. The adapter forwards props explicitly and disables implicit attribute fallthrough; it does not change node templates or persisted payloads.
- Extracted the node adapter for three Node/Vue rendering checks: data/selection/callback forwarding, rendered attribute equivalence, and raw renderer identity. These run through `test:frontend` and the combined `check` command, using the existing Node 24 runtime and Vue dependencies.

### Verification

- After the first corrections, local type checking reduced the original eight diagnostics to the two automation-editor diagnostics. Final results follow after integration.
- After integrating the automation corrections, a fresh `npm run typecheck` completed with exit 0. No TypeScript suppressions, dependency upgrades, or additional `any` annotations were added.
- Applied the repository's existing Prettier/import-order rules, with the bulk 226-file cleanup isolated in commit `1cdb3c4e`. This is baseline normalization, not the Solar Social/Afterglow redesign. The automation form's formatting accompanies its adapter extraction in `28c78799`; initial contract corrections are in `c6d3b712`.
- The complete `npm run check` passed on both Windows (Node 24.19) and the isolated Linux Docker runtime (Node 24.18.1): zero type/lint/format errors and **3 focused Vue rendering tests passed**. Those tests verify adapter equivalence, not a prior reported browser defect.
- The dependency lockfiles are unchanged. Wayfinder helpers remain generated and ignored. A local build cannot run because PHP is unavailable on Windows; the isolated Docker runtime supplies PHP for Wayfinder generation.
- Docker production-asset build passed with exit 0 in **9.62 seconds**. The existing dependency annotation and large-chunk warnings remain visible; no warning threshold was raised and no dependency was patched to hide them.
- Focused backend regressions passed: **280 tests, 1,042 assertions, 25.67 seconds**, using the separate `trypost_test` database and explicit environment overrides. No test was skipped in this selected run.
- After restarting only the development app to repair runtime-file ownership, all three development services were healthy and `/up` and `/login` returned **HTTP 200**. The development application database still held **0 users and 0 posts**. The three production TryPost containers remained healthy with **12 days** of uptime.
- The remote checkout remained clean after generation, build, tests, and restart. No production data, secrets, containers, or public routes were changed.

### Reproduce the selected backend regressions

```sh
docker compose -f compose.social-dev.yaml exec -T \
  -e APP_ENV=testing -e DB_DATABASE=trypost_test \
  -e CACHE_STORE=array -e SESSION_DRIVER=array \
  -e QUEUE_CONNECTION=sync -e MAIL_MAILER=array \
  app php artisan test --compact --ci \
  tests/Feature/Auth/AuthenticationTest.php \
  tests/Feature/WorkspaceInviteGuardTest.php \
  tests/Feature/PostControllerTest.php \
  tests/Feature/Welcome/WelcomeControllerTest.php \
  tests/Feature/App/WebhookTest.php \
  tests/Feature/Automation/AutomationCrudTest.php \
  tests/Feature/PostMediaAltTextValidationTest.php \
  tests/Feature/LocalizationParityTest.php
```

### Remaining work and limits

- This increment clears the initialized frontend type/lint/format failures. It does not introduce Solar Social/Afterglow, Observer permissions, approval rules, or archival behavior.
- Retain the existing Composer PSR-4 test-helper warning and Vite dependency/chunk warnings in the optimization backlog. They are not failures of the checks recorded above.
- The three adapter checks exercise Vue rendering and prop forwarding, not drag-and-drop interaction with all eight node types. Full authenticated browser flows and the entire PHP suite were not run in this increment.
- Scheduler, queue workers, realtime connections, and real social publishing remain deliberately disabled or unverified in the isolated runtime. No production rollout is authorized by these checks.
- Next product slice: branding tokens and the login/authenticated shell, with existing platform assets and translations preserved. Keep D-01 and the additive approval/archive backend milestones separate.

### Independent review

- Read-only review of `2a9ee9fd..1cdb3c4e` found no critical, important, or minor issues. It confirmed the media/error/reload/edge contracts and the final node adapter.
- The mechanical audit matched 221 of 226 cleanup files exactly to Prettier output from the parent revision. The other five differed only by ESLint import ordering or blank-line grouping; no behavioral formatter edits were found.
- The review identified inaccurate draft wording about retaining raw component objects; the log now describes the functional adapter correctly. Authenticated browser interaction with all eight node types remains a documented follow-up, not a claimed completed check.

## 2026-09-21 — Step 04: Solar Social / Afterglow first visual increment

### Scope and design lock

- Continue from `805ef33e` on the existing development branch. The approved identity/theme/login/shell slice is recorded in `solar-foundation-plan.md`; detailed calendar migration, approval features, and release-image packaging remain later increments.
- The approved Solar/Afterglow spec and `social-anamnesismd-full-preview.html` are the primary visual references. Exact palettes, existing Figtree typography, restrained surfaces, compact navigation, and original social-platform assets are retained.
- Refero research reviewed Pietrastudio (soft elevation and warm action hierarchy), Suno (dark-layer separation and sparse warm accents), and Understory's scheduling screen (compact persistent navigation with a large working canvas). These support narrowly scoped treatments, not replacement palettes or new workflows.
- Palette/accessibility ruling: preserve approved background/accent values, but use a dark foreground on coral action surfaces where white text would not meet normal-text contrast requirements. Do not weaken the theme or contrast checks to match an inaccessible mockup.

### Browser-runner preflight

- Ran the existing `AuthLegalLinksTest.php` against the unchanged baseline in isolated Docker with explicit `trypost_test` overrides: **2 failed, 0 assertions**, before any new visual implementation.
- The error was labeled `PlaywrightOutdatedException`, but both installed Playwright and the plugin's required version are **1.61.1**. A direct browser-launch probe identified the underlying issue: the expected Chromium headless executable is absent from `/root/.cache/ms-playwright/`. The plugin translates Playwright's generic installation message into the misleading outdated-version exception.
- The private application is reachable through the loopback-only SSH tunnel; the in-app browser successfully rendered the baseline login with the original platform assets. No dependency version was changed to address the test-runner message. Automated Pest browser coverage must not be reported as passing until a supported browser runtime exists.
- No production environment, account, or social connection is used for visual verification.

### Implementation

- Implementation commit `ba973055` adds the display brand, reusable mark/favicon, matching client/SSR titles, paired semantic palettes, and a non-submitting theme control in the active auth and navigation layouts.
- Theme initialization runs synchronously before the app; missing, invalid, or inaccessible storage selects Solar. The theme control updates the page without reload and persists when browser storage is available.
- Shared Button/Input/Card/Dialog styles use softer elevation and the approved radius scale. The auth carousel retains its six slides and ten platform images; rotation pauses for keyboard focus and reduced motion.
- Five new frontend tests exercise the actual pre-paint script, theme-state module, semantic color/contrast contract, and rendered Vue brand/theme controls. They join the three existing automation renderer checks. Initial failures established the missing initializer/module/component and old palette before implementation.
- The implementation leaves routes, permission and publishing logic, legal destinations, dependency versions, lockfiles, native social preview canvases, and calendar internals unchanged. Existing secondary auth/guest/welcome/popup/MCP layouts reuse the display identity without changing their flow.
- The approved Solar coral uses dark `#25121c` text (approximately 5.52:1 contrast). The exact approved muted color remains a token; the auth promotional copy uses full foreground on the soft surface for readability.

### Review and integration evidence

- Independent review identified one important issue: legacy status badge fills became unreadable against the new Afterglow foreground. It also found an ineffective desktop sidebar trigger and insufficient accessible semantics on compact branding.
- Fix commit `fb99c7aa` pairs badge status colors with contrasting foregrounds, keeps the trigger mobile-only, and gives the product mark an image role with its name. Regression tests failed before the fixes and now exercise the real components, desktop/mobile rendering conditions, and contrast in both palettes. Re-review found no remaining issues in this fix scope.
- The first implementation passed the complete frontend gate in Docker with **8/8** Node tests. The final `fb99c7aa` gate also passed in Docker: type checking, lint, formatting, and **10/10** Node tests, zero skips. Both final client and SSR bundles built successfully with exit 0; existing annotation/chunk warnings remain, and the SSR build reported plugin timing information. Local verification likewise passed **10/10** tests.
- Selected PHP regressions on `ba973055` passed: **280 tests, 1,042 assertions, 28.65 seconds**, with explicit `trypost_test` isolation and no skipped tests. The later fix changes only CSS, Vue components, and Node tests. This is the same eight-file selection documented in Step 03, not the full PHP suite.
- Real-browser desktop verification rendered Solar and Afterglow, retained Afterglow after reload, and loaded all ten original social images. Terms and privacy destinations remain `https://trypost.it/terms` and `https://trypost.it/privacy`.
- Pressing Enter on the theme control switched the theme with visible solid keyboard focus. Submitting an empty login produced the existing required-email/password errors while remaining on `/login`. No account or credentials were created or submitted.
- At an emulated width of **375px**, the document client width and scroll width were both **375px**. Mobile screenshot capture stalled and returned an unreliable scaled image; this proves the overflow measurement, not a complete visual mobile pass. All temporary viewport overrides were reset. Desktop screenshots were inspected in both themes, and no browser console errors/warnings were reported in these checks.
- After the final build, the browser reloaded the corrected version and switched to Afterglow by keyboard. Only the development app was restarted; all three development services became healthy, `/up` and `/login` returned **HTTP 200**, and the remote tracked checkout remained clean. The development database still contains **0 users and 0 posts**. Production containers retained continuous uptime (now rounded to **13 days**) and stayed healthy.
- Both implementation commits were pushed only to `codex/social-anamnesismd-foundation` on the user's fork. No production deployment, merge, release tag, dependency change, or lockfile change occurred. The private preview uses the loopback SSH tunnel at `http://127.0.0.1:18081/login`; it is available only while that tunnel is active.

### Coverage limits and next step

- The Pest browser runner is still blocked by its missing Chromium executable; manual browser evidence above is separate and must not be relabeled as passing Pest browser tests.
- Authenticated browser navigation remains pending explicit approval for a synthetic development account. No production account/data was reused. Component render tests cover the shell changes but are not authenticated end-to-end evidence.
- SSR bundle compilation is not hydrated-browser verification. SSR remains disabled by default; verify saved Afterglow state against server-rendered Solar before enabling hydration.
- The shared Sonner wrapper still contains legacy presentation styling, including a light-default description treatment. Full toast styling, detailed calendar migration, remaining legacy pages, mobile visual recheck, and immutable release-image packaging remain follow-ups. No production-ready/all-pages claim is made.
- The next product slice should validate the authenticated shell with approved synthetic data, then migrate calendar/post-list presentation without altering publishing or approval rules. D-01 and the Observer/approval/archive backend remain separate work.

## 2026-09-21 — Development demo login

- The user explicitly approved a fictitious login to inspect the internal application. Created `demo@social.example.invalid` (Demo Operator), its demo account, and the empty Demo Clinic workspace only in the isolated development Docker. Runtime guards verified the local environment, loopback app URL, and development database host before creation; a transaction prevented partial setup or overwriting an existing demo user.
- Used the existing factories and normal workspace membership/current-workspace relations. No authentication bypass, production account, social connection, post, or publishing job was added. The demo password is not stored in source control or this log.
- Signed in through the actual login form and verified the resulting `/calendar` page displays Demo Clinic, the navigation, the Afterglow control, and the empty calendar. The authenticated browser tab was left open for the user. This closes the basic login-to-shell smoke-check gap, not the full authenticated workflow or mobile visual coverage.
- The internal calendar/onboarding surfaces still contain legacy presentation styles; their migration remains the next visual increment.

## 2026-09-21 — Orbit-aligned calendar pilot

### Approved direction and reference ledger

- The user rejected the first increment's remaining neobrutalist presentation and approved a bounded sidebar/header/calendar pilot before migrating the remaining pages. This supersedes the earlier Figtree/display typography decision, not the Solar Social / Afterglow palette or the TryPost product structure.
- Primary references: [Orbit catalog](https://orbit-studio.humanagentlab3.chatgpt.site/catalogo) and [Orbit homepage](https://orbit-studio.humanagentlab3.chatgpt.site/#inicio), inspected in the browser. Adopt light Inter hierarchy, generous spacing, thin contours, diffused elevation, restrained translucent navigation, and compact capsule controls. Do not copy the marketing hero into the working calendar.
- Supporting Refero references: Linear Changelog (`11d3e58a-87d7-4a9a-bbf5-720f4fd3ffc6`) for layered dark surfaces and quiet typography; Dimension (`f2951292-dcf2-48db-af42-4bb3b783eb6e`) for restrained translucency. Orbit remains the controlling reference; these do not introduce replacement palettes or workflows.
- Use the exact approved coral/plum/yellow tokens as accents and semantic indicators. Primary actions become neutral foreground/background capsules. Existing platform marks and social preview assets remain unchanged. Inter uses the existing font provider; no dependency or lockfile change is required.

### Implementation and verification in progress

- Refined the shared shell, onboarding panel, button/badge/tab/select/popover primitives, and calendar day/week/month surfaces. Status color is reduced to a narrow card edge, preserving the existing status mapping. Removed repeated date headings and mobile fixed-width spacing; the date picker now truncates long labels.
- Added a translated day-view empty state using existing catalog keys. Its create action respects `canCreatePost` and carries the selected date. An actual Vue SSR regression test first failed because the component was absent, then passed for author and reader renderings after implementation.
- Routes, membership rules, publishing behavior, approval/archive work, backend schema, production containers, and dependency versions are outside this increment. Shared primitives also affect their existing consumers, but those pages are not claimed as fully migrated.
- The missing Chromium runtime limitation for Pest browser tests remains unchanged; manual browser checks below are separate evidence.

### Verification and coverage limits

- Implementation `1cf873ce` passed `npm run check`: type checking, lint, formatting, and **11/11 frontend tests**, no skips. The actual Vue SSR test covers the author/reader empty-state contract. Independent read-only review found no Critical or Important issues; its minor observation about date-to-URL integration was checked in the browser by selecting September 22 and observing `/posts/create?date=2026-09-22` on the empty-state action.
- The isolated development Docker built client and SSR bundles successfully (exit 0). Selected PHP regressions passed: **109 tests / 392 assertions**, using explicit `trypost_test` isolation: `WorkspaceRolePermissionsTest`, `PostControllerTest`, and `LocalizationParityTest`. This is not the full PHP suite.
- Inspected Solar and Afterglow desktop screenshots, day/week/month switching, the workspace menu, and date selection. At **390 x 844**, inspected both themes and the mobile sidebar; measured document client width and scroll width of **390px**, with no horizontal overflow. The sidebar opened and closed using the normal trigger/Escape behavior; the theme control worked with Enter. Reset the viewport override afterward.
- The real browser reported no captured errors or warnings during this pass. The demo workspace remains empty; populated post-card presentation is source-reviewed, not claimed as a populated end-to-end visual check. No real social connections or publishing actions were used.
- Visual QA identified the desktop's heavy native scrollbar; a final CSS-only refinement uses a thin, theme-aware scrollbar on sidebar content, including the portaled mobile sidebar. No scroll or keyboard behavior is removed.
- Development app, database, and Redis were healthy and `/up` returned **HTTP 200**. Production containers remained healthy with uninterrupted **13-day** uptime. No production deployment, merge, dependency change, or release tag occurred.
- Remaining legacy pages, toast presentation, populated calendar fixtures, approval/archive functionality, and release packaging remain separate increments. This pilot is not a completed all-pages migration.

## 2026-09-22 — Unified social-platform iconography

### Approved visual contract

- The user approved a first GPT-led implementation of monochrome social-network glyphs, consistent size/weight/alignment, no rotated stickers or heavy frames, and unchanged native post-preview appearance. This supersedes retaining colored PNGs in application chrome; it does not replace native preview renderers or change network behavior.
- The existing Orbit-led reference lock remains authoritative: quiet interface surfaces, controlled color accents, thin outlines. Refero's icon craft guidance supplies the single-family, optical sizing, `currentColor`, and named-versus-decorative accessibility rules. No new visual direction or bitmap generation is needed for editable SVG glyphs.
- Use the already installed Tabler Vue icon family rather than adding another dependency. Official references: [Tabler Vue icons](https://docs.tabler.io/icons/libraries/vue) and [Vue components](https://vuejs.org/guide/essentials/component-basics.html). Laravel Boost documentation tools are unavailable in this session; official documentation and the installed package were inspected instead.

### Implementation

- Added `PlatformIcon.vue` as the UI entry point for all 14 platform values / 12 network symbols. Instagram/Facebook and LinkedIn Page aliases resolve to their network glyph; unknown keys use a generic globe, never another company's mark. The typed mapping covers the current platform enum, and own-property lookup rejects prototype keys.
- Glyphs use the same 24-unit canvas and 1.65 stroke, inherit theme colors through `currentColor`, accept contextual size/color overrides, and expose either a platform name or decorative semantics. Native social preview canvases, user-uploaded avatars, provider-login buttons, and original assets remain untouched.
- Migrated calendar, post list/detail, channel selection, editor settings, preview selectors, scheduling, analytics selection, connection screens/dialogs, and the login network strip. Connection cards now use neutral unrotated icon frames and paired semantic status colors. Their connection/reconnection/deletion handlers and account eligibility logic are unchanged.
- Actual Vue SSR tests cover every network/alias, monochrome SVG output, accessible labels, decorative mode, contextual sizing/color, and unknown/prototype-key fallback. The initial test run failed because the component was absent; after implementation, a mistaken expected library class prefix was corrected to the installed Tabler output and the focused tests passed.
- Independent review identified a tooltip contrast regression, fixed with `text-background` on the media-issue glyph, and duplicated platform announcements in analytics options, fixed with decorative semantics. The reviewer verified both fixes with no remaining blockers.
- Full `npm run check` passed: Vue type checking, ESLint, Prettier, and **13/13 frontend tests**, with no skips. The installed Tabler prop contract requires a string stroke value; the component uses `stroke="1.65"`. `git diff --check` passed. Browser and isolated development build findings follow below when complete.

### Verification and coverage limits

- Implementation commit `6b4d7f55` was pushed to the existing development branch and fast-forwarded in the isolated development checkout. Client and SSR builds passed with exit 0; no dependency or lockfile changes were introduced.
- Selected PHP regressions passed: **66 tests / 121 assertions**, with explicit `APP_ENV=testing` and `DB_DATABASE=trypost_test` isolation: `WorkspaceRolePermissionsTest`, `MultipleAccountsConfigTest`, `NetworkUniquenessTest`, and `LocalizationParityTest`. This is not the full PHP suite.
- Browser inspection confirmed all **12** network SVGs on Connections, each at **28px** with **1.65** stroke width. Inspected Solar and Afterglow desktop screenshots and both themes at **390 x 844**; document client width and scroll width were both **390px**, with no horizontal overflow. Restored the default viewport and Solar theme afterward.
- Opened and closed only the local Instagram method chooser to inspect its icons. No OAuth provider was entered, account connected, or post created/published. The browser captured no errors or warnings during this pass. Connections was left open as the user-facing preview.
- Native post-preview renderers and original network assets are unchanged in the diff. The empty demo workspace does not permit a populated editor/calendar visual check; those consumers are source-reviewed, while the icon component itself is SSR-tested. Automated Pest browser tests remain outside this validation because the previously documented remote Chromium installation is unavailable.
- Development app, PostgreSQL, and Redis remained healthy; `/up` returned **HTTP 200**. Production containers retained their uninterrupted **13-day** uptime. No production deployment, merge, release tag, or public port exposure occurred.

## 2026-09-22 — Palette-colored social and MCP icons

### Approved direction and implementation

- The user requested more color in both themes, explicitly following the product palette rather than network brand colors, and included MCP connection icons. This supersedes the monochrome-only treatment above. The approved bounded design keeps recognizable silhouettes, fixed plum/rose/amber families, soft tinted tiles, fine strokes, and no rotated or heavy icon frames.
- Reference lock: the existing Orbit-led interface remains primary. Refero's color/icon craft guides inform paired colors, neutral surrounding surfaces, and a minimum 3:1 glyph contrast. The Inngest dark-surface reference was inspected only for restrained elevation; its CTA-only amber, typography, and monochrome icon rule were not adopted because the user explicitly selected this product's three-color palette. No new global palette, imagery, or dependency was introduced.
- Added the shared `IntegrationIcon.vue` presentation shell. `PlatformIcon.vue` assigns stable network tones, keeps account aliases together, and preserves explicit contextual color overrides such as the editor tooltip. Social connection tiles opt into tinted surfaces; compact application glyphs keep their existing geometry.
- Added `McpClientIcon.vue`, reusing the existing local SVG silhouettes through alpha masks, without modifying those assets. Primary and advanced MCP clients use the same palette shell. Connected-client rows retain their generic plug glyph with a plum tile; opaque OAuth client identities are not guessed from names. Setup URLs, JSON configuration, permissions, polling, clipboard actions, and connection/disconnection logic are unchanged.
- Dedicated integration ink/tint tokens derive from the approved palette, separately from success/warning/error tokens. Solar uses deeper rose and amber for contrast; Afterglow uses lighter shades without glow effects. Tokens reach at least 3:1 against their tile, card, background, and secondary surface in both themes.
- Followed RED/GREEN: new component rendering, alias/override, MCP silhouette/fallback, and palette contrast tests failed before implementation; the focused five-test suite then passed. Laravel Boost documentation tools were unavailable, so [Vue class/style bindings](https://vuejs.org/guide/essentials/class-and-style.html) and [Tailwind theme variables](https://tailwindcss.com/docs/theme) were consulted directly. Full verification and browser evidence follow below.

### Verification and coverage limits

- Implementation `d4c2b27f`: `npm run check` passed (type checking, ESLint, Prettier, **16/16 frontend tests**, no skips), as did `git diff --check`. Independent read-only review found no actionable issues. The isolated development client/SSR build exited 0.
- Selected backend regressions passed: **61 tests / 287 assertions** across `McpSettingsControllerTest`, `WorkspaceRolePermissionsTest`, and `LocalizationParityTest`, with explicit `trypost_test` database isolation. This is not the full PHP suite.
- Inspected Connections and MCP in Solar and Afterglow at the current desktop viewport and at **390 x 844**. Both pages measured a **390px** document client/scroll width at the mobile breakpoint. Confirmed all twelve social glyphs retain their **28px** display canvas and fixed tone family, and all six MCP choices resolve to local masks with themed ink/tints and no rotation. Inspected screenshots in both themes; no missing silhouettes were observed.
- Opened and closed the VS Code accordion and checked its rendered configuration. No external connector link, OAuth authorization, clipboard action, connection, or publishing action was triggered. No browser warnings/errors were captured. Restored the default viewport and Solar theme, and left MCP open for the user.
- The demo workspace has no connected clients or posts. Connected-client rows and populated editor/calendar contexts are source-reviewed, not claimed as populated end-to-end checks. Existing MCP card/input borders and unrelated page styling remain outside this icon-only increment. Original SVG assets, native post previews, dependency manifests, and backend behavior are unchanged.

## 2026-09-22 — Brand-aware pastels and functional icon consistency

### Approved direction

- The user approved retaining each network/provider's recognizable color family while preserving the pastel treatment, and extended that treatment to functional icons including upload, media, and labels. This supersedes the preceding three-color-only provider mapping. Orbit remains the primary layout reference; Refero's icon/color guidance continues to govern consistency, contrast, and quiet surrounding surfaces.
- Social glyphs now use blue (Facebook, LinkedIn, Bluesky), cyan (Telegram), red (YouTube, Pinterest), indigo (Discord), plum (Mastodon), rose (Instagram, TikTok), and graphite (X, Threads). These are theme-adjusted color families, not a claim of exact official brand color reproduction. Existing SVG silhouettes and native post-preview assets remain unchanged.
- MCP uses coral for Claude/Claude Code, blue for VS Code, graphite for ChatGPT/Cursor, and plum for generic clients. [OpenAI's brand guide](https://openai.com/brand/) supports keeping its mark uncolored; the existing local assets provide the other silhouettes. The attempted Meta brand page required login and the Anthropic brand page was unavailable, so neither was treated as verified guidance.
- Added a shared `IconTone` type and extended ink/tint tokens without changing product primary, semantic status, or chart tokens. Both themes retain minimum 3:1 contrast for each accent against its tile and standard content surfaces.
- Added `AppIcon.vue`: a centralized mapping by actual icon component identity gives upload blue, media rose, labels amber, and other navigation functions consistent pastel tones. It is reused by primary/support navigation, shared empty states, gallery upload, label filters, authentication feature slides, notification/preview empty states, and the scheduled editor indicator. It hides decorative glyphs from assistive technology while preserving surrounding labels and controls. Reactive component identities are normalized with `toRaw`.
- Removed rotated/heavy icon frames from those consumers. The gallery drag-over and scheduled-header surfaces now use theme-aware accent tokens. Directional controls, close buttons, loading indicators, destructive/status symbols, user-selected label colors, native social preview renderers, and feature behavior are unchanged. Analytics/automation-specific visualization glyphs remain a separate surface from this navigation/content icon increment.
- RED/GREEN: the updated brand-family, MCP, functional icon, and expanded contrast tests failed against the preceding implementation; all four focused tests passed after the change. Functional icon tests render real compact icons and their shared empty-state consumer to catch inconsistent tones, missing silhouettes, and decorative semantics.

### Verification and coverage limits

- Implementation `0e9940e3` passed `npm run check`: type checking, ESLint, Prettier, and **17/17 frontend tests**, no skips. Independent read-only review and `git diff --check` found no actionable issues. Isolated development client/SSR builds exited 0.
- Selected backend regressions passed: **57 tests / 188 assertions**, covering `WorkspaceLabelControllerTest`, `AssetControllerTest`, and `WorkspaceRolePermissionsTest`, with explicit `trypost_test` isolation. This is not the full backend suite.
- Visually checked Labels, Media, Connections, and MCP in Solar and Afterglow. Confirmed label/media identity is consistent between sidebar and content, and provider color families render correctly without changing silhouettes. At **390 x 844**, Media measured equal document client/scroll widths of **390px**; inspected the mobile sidebar and its normal open/Escape-close behavior, then restored the default viewport and Solar theme.
- No uploads, real connections, posts, or destructive actions were performed. The empty demo workspace limits visual checks to empty states and navigation; populated editor contexts remain source-reviewed. Production containers stayed healthy with uninterrupted **13-day** uptime; the development health endpoint returned **HTTP 200**. The user-facing preview was left on Media.

## 2026-09-22 — Company sidebar without upstream promotions

- Removed the upstream referral-program and Discord-community links from the company sidebar. Social-network connections, including Discord as a publishing platform, remain unchanged.
- Kept the existing documentation destination, visibly labeled with the localized documentation name followed by `· TryPost`. The brand suffix is language-independent; existing translation catalogs and unused upstream translation keys remain intact for compatibility.
- Preserved `LICENSE.md`, the upstream README and authorship notices, and the package license declaration without modification. This menu cleanup is not a license-compliance audit; retaining a documentation link is not a substitute for making the modified source available to service users.
- Added a regression test that renders the real sidebar inside its Inertia/sidebar providers, disables external broadcasting with Echo's null broadcaster, and checks documentation attribution, safe external-link attributes, absence of promotional destinations, company branding, and calendar navigation. It failed on the missing TryPost attribution before the implementation. The test supplies an undefined `window` binding for the existing optional-chain SSR helper and removes it afterward; no production SSR behavior was changed.
- Independent read-only review found no actionable issues. No dependencies, translations, backend routes, permissions, or publishing behavior changed.
- The initial desktop check exposed a truncated documentation suffix at the existing sidebar width. Support links now allow natural label wrapping and content-driven height so the upstream name remains readable; the pastel icon treatment is unchanged.
- Final verification (`653d3ac4`, followed by readability fix `06e0037f`): `npm run check` passed with **18/18 frontend tests**, no skips; `git diff --check` and both independent reviews found no issues. The isolated development client/SSR build exited 0. Browser inspection on Calendar confirmed the Portuguese documentation label and full TryPost name wrap visibly, with no referral/community links and no captured console warnings/errors. The development health endpoint returned **HTTP 200**; production containers remained healthy with uninterrupted **13-day** uptime. No PHP files changed and no backend suite was run for this menu-only change. The preview remains on Calendar.

## 2026-09-22 — Consistent soft surfaces throughout the company interface

### Approved direction and boundaries

- The user identified remaining heavy MCP frames and explicitly approved extending the Calendar/Connections surface treatment to all interface areas. The scope includes decorative cards, panels, dividers, dialogs and icon frames across MCP, settings, media, onboarding, notifications, post editing, analytics and automation chrome.
- Existing Calendar and Connections are the primary visual reference: thin theme-aware borders, soft elevation, rounded cards and unchanged brand-aware pastel icons. The Refero Aboard reference supports restrained elevation only; its typography, palette and marketing layout are not imported. The 21st component search returned accordion and integration examples, but existing Vue primitives already meet the need, so no external component or dependency is installed.
- Focus, selection and error indicators remain distinguishable. Native network previews, crop/color-picker handles and graph connection ports are intentional exceptions, not decorative framing. URLs, credentials, permissions, publishing behavior, translations and license/authorship files remain outside the change.
- Baseline frontend checks: **18/18 tests passed**. The MCP browser baseline showed **2px** opaque card borders in both themes; in Afterglow those frames became bright outlines around the cards and expanded configuration fields. This is the visual regression being corrected.
- Work is continuing in the established dedicated product checkout on `codex/social-anamnesismd-foundation`, with the existing isolated development deployment. No production deployment is authorized by this change. The implementation plan is recorded in `docs/superpowers/plans/2026-09-22-soft-surface-consistency.md`.

### Implementation and verification notes

- The first implementation updates decorative application surfaces and shared controls, including MCP configuration, settings, media, post editing, onboarding, notifications, toasts and JSON output. Real-component regressions cover MCP destinations and controls, label selection/disabled behavior, and textarea focus/invalid styling. The regressions failed against the old frames before the implementation.
- Independent review caught three retained dark semantic foregrounds on newly theme-aware backgrounds (API-key notice, current-session status and delete-confirmation icon). Commit `67bfa30e` corrected these to paired semantic tokens and removed permanent selection rings from static billing icon tiles. Focused re-review approved every correction; the real-component fixture passed 14/14 tests.
- The installed `21st review` excludes `.vue` from its supported extensions: a scoped MCP invocation reviewed zero files, not a passing Vue audit. Its JSON-viewer CSS check reviewed one file with no findings. Vue verification therefore relies on component rendering tests, type/lint checks, independent code review and actual browser inspection.

### Clarified delivery scope

- The user's follow-up restates the immediate deliverable as consistent MCP application cards, configuration fields and connected-client rows in both themes, without changing connection functionality. Complete and verify that deliverable now; do not hold it behind an additional automation/metrics redesign. Previously committed application-surface improvements are preserved.
- Automation/metric changes were not implemented after the write restriction. The provisional npm command referencing their nonexistent fixture has been removed, so the existing frontend check remains independently runnable. This delivery does not claim the deferred automation work is complete.

### MCP delivery verification

- `npm run check` passed with **22/22 frontend tests**, no skips, plus type checking, ESLint and Prettier. Final independent review of `c53dec58..83377dcb` found no actionable issues. Protected backend, dependency, license and native-preview files have no changes in this increment.
- The isolated development client/SSR build exited 0; `/up` returned **HTTP 200**. Selected backend regressions passed with **61 tests / 287 assertions** using the explicit `trypost_test` database. Production containers remained healthy with uninterrupted **13-day** uptime; this is not a production deployment or a full PHP-suite run.
- Browser inspection confirmed primary MCP cards have **1px** theme borders and **16px** corners in Solar and Afterglow. Opened all four advanced clients and checked their name, URL and JSON configuration; no connect/disconnect or clipboard action was invoked. Enter toggles the accordion and retains a visible keyboard-focus ring.
- At **390 x 844**, inspection caught an intrinsic grid-width issue despite equal document client/scroll widths: a 285px URL group contained a 363.6px field, clipping the copy control. The configuration wrappers require `min-w-0` so URL truncation and internal JSON scrolling can work without clipping the action. This visual check is the regression baseline for the final responsive correction.
- The demo workspace has no connected clients. Populated rows and their permission/confirmation paths are source-reviewed, not claimed as a populated end-to-end connection test.
- Responsive correction `0f8bde6b` adds `min-w-0` to the three configuration grid children. Scoped review found no new issues, and the final `npm run check` again passed **22/22 tests** with type/lint/format checks. The final development client/SSR build exited 0.
- Post-build browser GREEN at **390 x 844**: URL field and group both measure **285px**, with the copy button ending at **321px**, inside the available area. Solar and Afterglow screenshots confirm visible copy controls, truncated URL text and horizontal scrolling contained within the JSON block. Restored the default desktop viewport and Solar theme, left MCP open, and captured no console warnings/errors after the final load. No real connection, disconnection, copy, publish or deletion action was performed.
