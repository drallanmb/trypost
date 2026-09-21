# Development Log

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
- Full verification and browser findings will be appended after the development build. The missing Chromium runtime limitation for Pest browser tests remains unchanged.
