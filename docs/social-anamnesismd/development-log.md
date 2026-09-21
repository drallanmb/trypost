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

## 2026-09-21 — Step 02: Isolated development runtime (in progress)

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
- Added a development-only FPM pool override matching the entrypoint's UID-1000 `app` user. Verification after this fix is recorded below.
