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
