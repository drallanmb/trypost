# Solar Social / Afterglow — First Visual Increment

Source: the approved 2026-09-21 frontend foundation spec and the user's instruction to proceed after technical-baseline verification. Baseline: `805ef33e`. This increment covers identity, themes, login, and the existing navigation shell, not the entire six-task foundation roadmap.

## Constraints and reference lock

- Preserve routes, server behavior, authorization, form submissions, translations, publishing, network assets, dependency versions, and the AGPL license. No production deployment.
- Product identity: Social AnamnesisMD. Existing technical TryPost identifiers remain unchanged.
- Approved Solar colors: background `#f5f1f7`, soft `#eee8f2`, card `#ffffff`, text `#302c38`, muted text `#716a7a`, coral `#ed5f7a`, plum `#68479b`, yellow `#f5c84c`, border `rgba(80, 58, 92, 0.13)`, success `#2f7d65`, danger `#c64a5a`.
- Approved Afterglow colors: background `#17121d`, soft `#211824`, card `#2b2131`, text `#fbf7f0`, muted text `#bcb2c1`, magenta `#f05f9b`, violet `#9a6cff`, amber `#f7b64d`, border `rgba(255, 255, 255, 0.11)`, success `#68c9a1`, danger `#ff7d8f`.
- Theme values exactly `solar` and `afterglow`; storage key `social-anamnesismd.theme`; HTML `data-theme`; default Solar even with missing, invalid, or inaccessible storage. Apply before first paint and before Vue mounts. Switching must not reload or submit forms.
- Retain Figtree and existing display font; no font or runtime dependency additions. Controls 12px radius, cards 18px, auth surfaces 22–30px; restrained soft shadows replace offset shadows.
- Primary source: approved Solar/Afterglow prototype/spec, not a new palette. Refero Pietrastudio informs only soft surface/elevation and warm action hierarchy; Suno informs only dark-layer separation and sparse warm accents. Do not copy their fonts, content, or layouts. Preserve native social images as existing product evidence; no fabricated media.
- Keep dense operational navigation and existing layout hierarchy. Login keeps its carousel and every form/legal/social-login behavior. Decorative atmospheric color stays in its promotional half; form fields remain opaque.
- Do not redesign post preview canvases or calendar internals in this increment. Global token effects are expected; do not claim all pages have been migrated.

## Rulings from plan review

1. Continue in the existing clean product checkout and development branch already used for this project; do not edit the unrelated second-brain application. A new worktree is not needed to separate this work from production.
2. Group identity, theme infrastructure, and their first mounts as one cohesive implementation task because they share app boot, CSS, and layouts. A second implementation agent must not concurrently edit them.
3. Use the approved brand constant as the display source, not a legacy `VITE_APP_NAME` or server `APP_NAME` fallback that could silently retain TryPost branding. Do not mutate backend environment or OAuth identity.
4. Preserve exact brand colors but use a contrasting dark foreground on coral controls where white fails WCAG AA. UI focus and input boundaries may use accessible derived tokens distinct from decorative surface borders. Cost if wrong: a small visible contrast adjustment to the mockup.
5. Browser testing must be proven in the available runtime before claiming coverage. Local Windows lacks PHP; the isolated Linux Docker supplies PHP. Node tests can cover frontend state directly without new dependencies; Pest contracts and real-browser verification remain part of integration. Report unavailable coverage explicitly.
6. The immutable release image, detailed calendar migration, and full 54-page regression are subsequent increments; do not tag a completed foundation release now.

## Interface review

| Task/interface | Producer and consumer | Review |
| --- | --- | --- |
| Identity / layouts / app boot | Brand constant and reusable mark feed title, login, sidebar | One identity source; no internal renames |
| Theme / pre-paint / Vue | Exact storage key and validated values feed HTML and reactive UI | Match defaults and blocked-storage behavior |
| Tokens / shared primitives | CSS variables feed existing CVA and Reka components | Preserve APIs, focus, density, native preview colors |
| Tests / implementation | Real state behavior plus visual and server contracts | No source-only check substituted for runtime coverage |
| Task 1 | Implementation agrees with tests and allowed paths | Cohesive scope, no backend mutations |
| Task 2 | Integration consumes Task 1, existing private Docker | Separate test DB; no production rollout |

### Task 1: Implement the approved visual foundation

Read the constraints above as binding requirements. Read product AGENTS.md and applicable local domain skills. Write failing focused tests first; verify RED, implement, verify GREEN.

Create `resources/js/brand.ts`, `components/brand/ProductBrand.vue`, `composables/useTheme.ts`, and `components/ThemeToggle.vue`. A small pure theme-state module is allowed if needed to test the real behavior with Node without coupling tests to a bundler; do not build a framework.

Modify `resources/css/app.css`, `resources/views/app.blade.php`, `resources/js/app.ts`, and `public/favicon.svg` for exact theme tokens, pre-paint behavior, titles, and brand. Preserve all existing CSS mappings. Replace every global offset shadow level, define both light/dark status and chart colors, and respect reduced motion. Avoid global element overrides that restyle native social previews.

Mount brand/theme in the active login/auth and authenticated shell paths after tracing their actual use. Restyle the auth split surface and existing social carousel without removing its assets, controls, descriptions, or login functions. Use existing locale strings or proper matching catalog keys; brand and theme proper names are not translated. Use real active shell components, not only unused legacy headers. Other auth/welcome/popup/MCP layouts can reuse identity with minimal presentation-only changes where appropriate; keep consent and popup behavior untouched.

Retheme existing Button, Input, Card, and Dialog primitives using their current public interfaces. Preserve focus-visible states, disabled/loading states, keyboard control, readable contrast, responsive navigation, and collapsed-sidebar identity. Do not add duplicate navigation or operator/observer UI.

Add focused automated tests of default/invalid/blocked storage, switching/persistence, exact semantic colors, and visible brand/theme controls. Prefer existing Pest conventions for PHP and the already-established Node test gate for frontend behavior. All tests must run or be explicitly marked pending rather than silently skipped. Keep dependency lockfiles unchanged. Run `npm run check`; do not run the unavailable local PHP build repeatedly. Main controller runs Docker build/PHP/browser integration.

Commit only your implementation and tests, not controller documentation. Report TDD evidence, test commands/results, changed files, and unresolved concerns. Do not push, deploy, access production, create data, or spawn subagents.

### Task 2: Integrate and verify privately

- Review Task 1 against this brief and the approved spec. Fix important findings through the implementer.
- Run frontend gate/build and affected Pest regressions in the isolated development Docker with explicit `trypost_test` overrides.
- Verify login Solar/Afterglow, persistence/fallback, mobile overflow, keyboard focus, legal links, and shell rendering with real browser evidence. Keep any synthetic browser fixtures test-only and distinguish fixture rendering from authenticated end-to-end coverage.
- Compare screenshots with the locked source; fix P0/P1/P2 regressions before handoff.
- Restart only development services if tooling changes runtime ownership. Check health/login responses and confirm production uptime is unchanged.
- Update the development log with changes, review, evidence, limits, and next step. Publish only the development branch to the user's fork; never deploy or tag a production release in this increment.
