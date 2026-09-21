# Social AnamnesisMD Development

This directory records the product's decisions, environment, and verification evidence. Update `development-log.md` with every development increment, including failed checks and deferred work. Documentation is written in English; application copy uses upstream localization catalogs.

## Source and branches

- Fork: https://github.com/drallanmb/trypost
- Upstream: https://github.com/trypostit/trypost
- Product baseline: v1.0.9, `a932c51bbb95348ed93f662bdad4038aabf2ec88`.
- `main` follows upstream; `product/social-anamnesismd` contains product releases.
- Current implementation branch: `codex/social-anamnesismd-foundation`.
- Generic contributions should branch from upstream independently of product branding.

## Development environment

`compose.social-dev.yaml` is a standalone Compose definition. Do not merge it with production Compose files. It uses a dedicated project name, default network, and named volumes; PostgreSQL and Redis have no host ports. Only HTTP is published, at host loopback port 18081. No external network, production volume, or production environment file is referenced.

The development database password in this file is deliberately non-secret and used only in this isolated stack. Never use this definition for a public deployment. Never copy production credentials or data into it.

The existing upstream entrypoint installs locked dependencies, generates development keys, migrates the development database, and generates Wayfinder modules. A separate supervisor configuration starts PHP-FPM and nginx only. The development FPM pool runs as `app` (UID 1000), matching the entrypoint's runtime-directory ownership. Scheduler, Horizon, Vite, and Reverb do not run. Mail uses logs, telemetry is disabled, and queued work is not consumed automatically. This environment validates built assets; realtime and background workers require a separate later test step.

From a dedicated checkout on a Docker host:

```sh
docker compose -f compose.social-dev.yaml config --quiet
docker compose -f compose.social-dev.yaml up -d --build --wait --wait-timeout 600
docker compose -f compose.social-dev.yaml logs --tail=80 app
docker compose -f compose.social-dev.yaml exec -T app npm run build
docker compose -f compose.social-dev.yaml ps
curl -f http://127.0.0.1:18081/up
```

Wait for container health before running the asset build: the entrypoint installs dependencies after the container starts. `up -d` alone does not mean bootstrap has finished.

Use an SSH tunnel to view the private application from your workstation:

```sh
ssh -N -L 18081:127.0.0.1:18081 root@srv1572131.taildc6860.ts.net
```

Then open `http://127.0.0.1:18081/login`. No public reverse-proxy route is created. The fresh environment contains no production accounts or connected social profiles.

## Baseline verification

Run only against this dedicated development stack. The test suite uses `trypost_test`, distinct from the application's `trypost` database and every production database.

```sh
docker compose -f compose.social-dev.yaml exec -T app php --version
docker compose -f compose.social-dev.yaml exec -T app composer check-platform-reqs
docker compose -f compose.social-dev.yaml exec -T -e APP_ENV=testing -e DB_DATABASE=trypost_test -e CACHE_STORE=array -e SESSION_DRIVER=array -e QUEUE_CONNECTION=sync -e MAIL_MAILER=array app php artisan test --compact --ci
docker compose -f compose.social-dev.yaml exec -T app npm run format:check
docker compose -f compose.social-dev.yaml exec -T app npx eslint .
docker compose -f compose.social-dev.yaml exec -T app npx vue-tsc --noEmit
docker compose -f compose.social-dev.yaml exec -T app npm run build
docker compose -f compose.social-dev.yaml restart app
docker compose -f compose.social-dev.yaml up -d --wait --wait-timeout 120
curl --fail --silent --show-error --output /dev/null http://127.0.0.1:18081/up
curl --fail --silent --show-error --output /dev/null http://127.0.0.1:18081/login
```

The explicit test environment overrides are required: container-level environment values take precedence over PHPUnit's non-forced defaults. `--ci` disables local test-impact caching so checks actually execute. Append specific test paths for a targeted check; omit them for the complete Unit and Feature suites. Never run database-resetting tests against the application database. Record existing failures before altering upstream application code. A successful container healthcheck is not equivalent to passing application tests.

The final restart re-runs the upstream ownership repair after root-run tooling creates cache or log files. HTTP smoke checks exercise the actual FPM worker and catch permission failures that root-run CLI tests miss. The pool's `user` and `group` settings follow the [official PHP-FPM configuration reference](https://www.php.net/manual/en/install.fpm.configuration.php).

## Stop and resume

```sh
docker compose -f compose.social-dev.yaml stop
docker compose -f compose.social-dev.yaml start
```

Do not use `down -v`: the named volumes contain development data and dependencies. Production rollout, backup validation, and compatible rollback are separate milestones.

## Product boundary

The current product scope includes both frontend branding and additive backend work: a client Observer dashboard, server-enforced approval, one rejection with a mandatory reason, one revision round, immutable post history, and archival instead of permanent post deletion. Existing TryPost operational capabilities are retained.

Approval after the single revision remains decision D-01. Until resolved, the provisional PRD rule requires explicit physician approval of the revised version, with no second rejection. Environment preparation does not authorize an automatic publishing exception.
