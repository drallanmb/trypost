# Soft Surface Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Calendar/Connections surface treatment throughout the company interface, including MCP.

**Architecture:** Reuse existing theme tokens and Vue primitives. Replace decorative heavy borders and offset shadows at their consumers rather than overriding all borders globally. Preserve functional selection/focus/error indicators and native social previews.

**Tech Stack:** Vue 3, Inertia 3, Tailwind 4, Node rendering tests, Laravel.

**Spec:** User-approved chat direction: thin discreet borders, rounded corners, soft shadows, existing pastel icons, Solar and Afterglow; expanded to all interface areas on 2026-09-22.

**Delivery clarification:** The subsequent user message specifically restates MCP applications, configuration fields and connected-client rows. Deliver and verify that already-implemented scope now. Task 2 is deferred and is not claimed complete; retain the existing application-surface improvements from Task 1.

## Global Constraints

- No dependencies, backend behavior, permissions, routes, copy, license or authorship changes.
- Native social previews, crop handles, color-picker handles, graph connection ports and semantic status strokes keep their functional styling.
- Calendar and Connections are the primary reference. Aboard's Refero reference contributes restrained elevation only, not its palette or typography. Existing theme tokens remain authoritative.
- Use `border border-border`, `rounded-2xl` for card surfaces, and existing `shadow-2xs`/`shadow-sm` tokens. Use `border-input` for identifiable input boundaries and `ring-ring` for focus/selection.

### Task 1: Application surfaces and MCP

**Files:** `resources/js/components/mcp/*.vue`, `resources/js/pages/settings/workspace/Mcp.vue`, `resources/css/json-viewer.css`, app-owned Vue surface consumers under `resources/js/components/`, `resources/js/pages/`, `resources/js/layouts/`; exclude native `posts/previews/` and Task 2 files. Test: `tests/fixtures/brand-theme-controls.test.js`.

**Interfaces:** Preserve all props, events, attributes, hrefs and public component APIs. No new production APIs.

- [x] Add a real-component rendering regression for MCP and representative shared surfaces:
  ```js
  const app = createSSRApp(McpPrimarySetup, { mcpUrl: 'https://example.invalid/mcp', copiedMessage: 'Copied' });
  app.config.globalProperties.$t = key => key;
  const html = await renderToString(app);
  assert.doesNotMatch(html, /border-2|border-foreground/);
  assert.match(html, /https:\/\/example.invalid\/mcp/);
  assert.match(html, /data-testid="copy-mcp-url"/);
  ```
- [x] Run the focused test and verify it fails on the existing heavy frame.
- [x] Inspect heavy-border call sites and replace decorative framing, preserving semantic exceptions:
  ```html
  <article class="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-2xs">
  ```
- [x] Keep selected surfaces distinguishable with theme-aware accent surfaces and focus rings, without fixed light-only selection backgrounds.
- [x] Run focused tests, type checking and read-only review.

### Task 2: Automation and metric surfaces

**Files:** `resources/css/automations.css`, `resources/js/components/automations/**`, `resources/js/pages/automations/**`, `resources/js/components/analytics/**`, `resources/js/components/settings/UsageMetricCard.vue`. Test: `tests/fixtures/soft-automation-surfaces.test.js`.

**Interfaces:** Keep node dimensions, ports, drag handlers, callbacks, metric data and props unchanged.

- [ ] Add/render representative metric and automation UI coverage before modifying presentation; capture the heavy-frame failure.
- [ ] Replace opaque border/offset-shadow decoration with existing tokens; keep selection explicit:
  ```css
  .automation-node { border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
  .automation-node.is-selected { outline: 2px solid var(--ring); outline-offset: 2px; }
  ```
- [ ] Reuse integration ink/tint tokens on metric and graph icon tiles. Remove ornamental rotation, not expand/collapse rotations.
- [ ] Run targeted tests and report changed files and preserved functional borders.

### Task 3: Integration verification and delivery

**Files:** `.21st/design.json`, `.21st/DESIGN.md`, `package.json` (test command only), `docs/social-anamnesismd/development-log.md`.

- [ ] Run `npm run check`, `git diff --check` and `21st review` on changed UI paths; inspect exceptions and protected-file diffs.
- [ ] Commit and update only the isolated development environment. Run `npm run build:ssr` and verify `/up` returns 200.
- [ ] Inspect MCP main cards, expanded advanced configuration, empty connected-client state and representative settings/media/automation screens in both themes. Check narrow layout and focus without connecting, saving, publishing or deleting.
- [ ] Document checks, untested populated states, exceptions and development-only deployment. Leave MCP open.
