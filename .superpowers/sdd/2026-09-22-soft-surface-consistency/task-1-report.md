# Task 1 report: application soft surfaces and MCP

Status: implemented and verified; parent owns deployment and visual QA.

## Scope and implementation

Updated 78 presentation files plus the real-component regression fixture. Decorative two-pixel foreground frames became thin theme-border surfaces; framed cards use rounded-2xl and existing lightweight elevation. Shared select/textarea/switch and the code editor use input boundaries where needed. Replaced offset ink shadows and ornamental rotations without changing functional icon orientation. MCP copy controls, connector URLs, external-link attributes, component APIs, routes, translations and event handlers are preserved.

Selected label, style, workspace, editor-option and account surfaces use theme-aware accent backgrounds and rings; selected problematic channels retain destructive rings. Fixed pale-background/inherited-foreground combinations in icon tiles, onboarding panels, billing banners, authentication status and webhook status tiles. Toasts use card/foreground/border/elevation tokens and keep distinct semantic status icons. JSON highlighting uses existing theme integration inks on the card surface; serialized output is unchanged.

No dependency, package.json, README, LICENSE, .21st, deployment, backend or native post-preview changes. Existing parent development-log modifications were not staged. No browser interaction or subagents were used.

## RED / GREEN evidence

- Before production edits: `node --test --test-name-pattern='soft theme surfaces|theme-aware surfaces' tests/fixtures/brand-theme-controls.test.js` exited 1: two intended assertion failures, zero passes. Real McpPrimarySetup SSR contained `border-2 border-foreground`; real selected LabelBadge SSR lacked the requested theme-aware accent surface.
- After implementation: `node --test tests/fixtures/brand-theme-controls.test.js` exited 0: 12 tests, 12 passed.
- `npm run check` exited 0: vue-tsc, ESLint, full resources Prettier check, and all 20 frontend tests passed.
- Final presentation-only refinements to Discord mention/input styling and selected workspace background override were checked with targeted Prettier and `git diff --check`, both passed.
- Regressions render real MCP, LabelBadge and Textarea components and assert connector URLs, external-link safety attributes, copy-button type/test ID, label content/color, disabled interactive versus display-only semantics, selected ring, invalid-input styling and focus styling.
- No screenshots were taken here. Parent is performing full dev-environment Solar/Afterglow browser QA.

## Preserved exceptions and review notes

- ImageCropperDialog: the white crop selection frame, shadow outline and four foreground resize-handle boundaries remain for visibility over arbitrary image content.
- HexColorInput: both white pointer boundaries and black contrast rings remain for visibility over arbitrary colors. Preset swatch values and selection behavior are unchanged.
- AuthSplitLayout: slide-pagination foreground boundary remains as a functional state cue.
- Structural rotations remain for chevrons, vertical carousels, tooltip arrows, sidebar and resize handles.
- Native components/posts/previews, automation and analytics components, and UsageMetricCard are untouched. Usage page rotate props remain for the Task 2 owner to handle alongside its component API.
- Explicit paired pale error/warning backgrounds and dark semantic text remain where already readable (for example DeleteUser, DeleteWorkspace, editor warnings). Error content, validation branches and focus rings remain intact.
- Final scoped heavy-border/offset-shadow search returns only the documented crop/color/pagination exceptions. Framework chart tooltip indicator geometry was inspected and preserved.
- AGENTS and local frontend skills were read. The .ai/rules index is absent, consistent with the standing instruction not to create that folder. No callable search-docs tool was exposed; official Tailwind border-width and box-shadow documentation was consulted as fallback.
- Main multi-file apply_patch ran slowly; repeated literal class occurrences were completed with an authorized bulk mechanical replacement, followed by manual review and nuanced apply_patch corrections.

## Files

- `resources/css/json-viewer.css`
- `resources/js/components/BrandForm.vue`
- `resources/js/components/ChannelConfigurator.vue`
- `resources/js/components/CodeEditor.vue`
- `resources/js/components/ConfirmDeleteModal.vue`
- `resources/js/components/DatePicker.vue`
- `resources/js/components/DeleteUser.vue`
- `resources/js/components/EmptyState.vue`
- `resources/js/components/HexColorInput.vue`
- `resources/js/components/ImageCropperDialog.vue`
- `resources/js/components/JsonViewer.vue`
- `resources/js/components/NotificationBell.vue`
- `resources/js/components/UserInfo.vue`
- `resources/js/components/WorkspaceMenuContent.vue`
- `resources/js/components/accounts/TelegramConnectDialog.vue`
- `resources/js/components/ai/ContentStylePicker.vue`
- `resources/js/components/assets/GalleryBrowser.vue`
- `resources/js/components/labels/LabelBadge.vue`
- `resources/js/components/mcp/McpAdvancedClients.vue`
- `resources/js/components/mcp/McpPrimarySetup.vue`
- `resources/js/components/onboarding/OnboardingStepCard.vue`
- `resources/js/components/posts/EmojiPicker.vue`
- `resources/js/components/posts/ai/AiGenerateDialog.vue`
- `resources/js/components/posts/ai/AiReviewDialog.vue`
- `resources/js/components/posts/create/AiPostWizard.vue`
- `resources/js/components/posts/editor/CommentsTab.vue`
- `resources/js/components/posts/editor/DiscordSettings.vue`
- `resources/js/components/posts/editor/FacebookSettings.vue`
- `resources/js/components/posts/editor/InstagramSettings.vue`
- `resources/js/components/posts/editor/LinkedInSettings.vue`
- `resources/js/components/posts/editor/PinterestSettings.vue`
- `resources/js/components/posts/editor/PostEditorActionBar.vue`
- `resources/js/components/posts/editor/PostEditorComposer.vue`
- `resources/js/components/posts/editor/PostEditorHeader.vue`
- `resources/js/components/posts/editor/PostEditorMobileNav.vue`
- `resources/js/components/posts/editor/PreviewTab.vue`
- `resources/js/components/posts/editor/ScheduleTab.vue`
- `resources/js/components/posts/editor/TikTokSettings.vue`
- `resources/js/components/settings/DeleteWorkspace.vue`
- `resources/js/components/ui/combobox/ComboboxInput.vue`
- `resources/js/components/ui/combobox/ComboboxList.vue`
- `resources/js/components/ui/command/CommandInput.vue`
- `resources/js/components/ui/date-range-picker/DateRangePicker.vue`
- `resources/js/components/ui/dropdown-menu/DropdownMenuSubContent.vue`
- `resources/js/components/ui/native-select/NativeSelect.vue`
- `resources/js/components/ui/range-calendar/RangeCalendarCell.vue`
- `resources/js/components/ui/range-calendar/RangeCalendarCellTrigger.vue`
- `resources/js/components/ui/sonner/Sonner.vue`
- `resources/js/components/ui/switch/Switch.vue`
- `resources/js/components/ui/table/Table.vue`
- `resources/js/components/ui/table/TableHeader.vue`
- `resources/js/components/ui/table/TableRow.vue`
- `resources/js/components/ui/textarea/Textarea.vue`
- `resources/js/components/webhook/WebhookLogDetail.vue`
- `resources/js/components/webhook/WebhookLogList.vue`
- `resources/js/components/webhook/WebhookLogViewer.vue`
- `resources/js/components/webhook/WebhookOverview.vue`
- `resources/js/components/webhook/WebhookShowHeader.vue`
- `resources/js/pages/billing/Processing.vue`
- `resources/js/pages/labels/Index.vue`
- `resources/js/pages/mcp/Authorize.vue`
- `resources/js/pages/mcp/AuthorizeError.vue`
- `resources/js/pages/onboarding/Index.vue`
- `resources/js/pages/posts/Create.vue`
- `resources/js/pages/posts/Edit.vue`
- `resources/js/pages/posts/Show.vue`
- `resources/js/pages/posts/ai/Loading.vue`
- `resources/js/pages/settings/Index.vue`
- `resources/js/pages/settings/account/Billing.vue`
- `resources/js/pages/settings/profile/Authentication.vue`
- `resources/js/pages/settings/profile/Notifications.vue`
- `resources/js/pages/settings/workspace/ApiKeys.vue`
- `resources/js/pages/settings/workspace/Mcp.vue`
- `resources/js/pages/welcome/Goals.vue`
- `resources/js/pages/welcome/Persona.vue`
- `resources/js/pages/welcome/ReferralSource.vue`
- `resources/js/pages/welcome/SubscriptionRequired.vue`
- `resources/js/pages/workspaces/Index.vue`
- `tests/fixtures/brand-theme-controls.test.js`
