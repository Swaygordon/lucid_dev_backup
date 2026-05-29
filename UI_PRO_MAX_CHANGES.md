# Sky & Ember UI/UX Redesign — Change Log

A full-app visual revision driven by the **ui-ux-pro-max** skill. The skill's
design-system generator was run for an "on-demand local services marketplace",
and from its recommendations the **Sky & Ember** direction was selected:

- **Primary** — sky / azure (bright, trustworthy)
- **Secondary** — warm orange ("ember") accent
- **Type** — Plus Jakarta Sans across the whole UI
- **Surfaces** — soft, subtly-elevated cards (Soft-UI evolution), 12px default radius
- **Motion** — 150–250ms color/shadow transitions, gentle hover lifts

Rollout was **foundation-first** (tokens + shared components, so changes
propagate) followed by a per-page polish sweep. Every phase was verified with
`npm run build`.

---

## 1. Foundation (design tokens)

### `tailwind.config.js`
- **Fonts:** `sans` now leads with `"Plus Jakarta Sans"` (was Inter); `display` unchanged family.
- **Primary → sky/azure:**
  - `DEFAULT #0277bd` (AA-safe azure, 4.8:1 with white text on solid fills)
  - `hover #0369a1`, `light #0ea5e9` (bright sky accent), `dark #075985`, `50 #f0f9ff`
  - (was blue: `#2563eb / #1d4ed8 / #3b82f6 / #1e40af / #eff6ff`)
- **Secondary → ember orange:** `DEFAULT #c2410c`, `hover #9a3412`, `light #f97316`, `dark #7c2d12`, `50 #fff7ed`.
- **`info`** aligned to the sky brand: `#0ea5e9` (was `#3b82f6`).
- **Border radius scale added:** `DEFAULT 8px`, `lg 10px`, `xl 12px`, `2xl 16px`, `3xl 24px`.
- **Shadows softened** to low-alpha, slate-tinted, multi-layer (`sm/md/lg/xl`); glow shadows retinted to the sky palette; added `glow-sky`.

### `src/index.css`
- Body font set to Plus Jakarta Sans; added font antialiasing.
- Headings: letter-spacing `-0.02em` + `text-wrap: balance`.
- Page background → sky wash `#f0f9ff` with a sky-tinted dot grid; dark mode → `#0b1220` with `#172033` dots.

### `index.html`
- Webfont link now loads **Plus Jakarta Sans weights 400–800** only (dropped the Inter request).

### `src/utils/theme.js`
- The JS theme mirror updated to match the new primary/secondary/info tokens.

---

## 2. Shared components (refreshed once, propagate everywhere)

| File | Change |
|------|--------|
| `components/ui/Button.jsx` | Added `cursor-pointer` + visible `focus-visible` ring to base; outline/ghost dark variants `blue-400 → sky-400`. |
| `components/ui/Input.jsx` | `rounded-lg → rounded-xl`; focus ring `blue → sky`; error-state focus ring. |
| `components/ui/Modal.jsx` | Backdrop `bg-black/50 → slate-900/60` + `backdrop-blur-sm`; panel `rounded-xl → rounded-2xl`, `shadow-2xl → shadow-xl` + hairline ring. |
| `components/ui/FilterBar.jsx` | `rounded-lg → rounded-xl`; added `cursor-pointer` + focus ring. |
| `components/ui/Avatar.jsx` | Gradient `from-primary to-purple-600 → from-sky-400 to-primary`. |
| `components/ui/StatCard.jsx` | `blue` variant gradient recolored to sky; new `sky` variant added. |
| `components/ui/StatusBadge.jsx` | `in-progress` and `normal` states `blue → sky`. |
| `components/shared/ProfileCard.jsx` | Card `rounded-2xl` + ring + `hover:shadow-lg`; button `rounded-xl` + focus ring. |
| `components/navbar.jsx` | Account-menu focus ring `blue-500 → primary-light`. |

`components/footer.jsx` and `components/shared/BookingCard.jsx` were already
token-based, so they picked up the new brand automatically (no edits).

---

## 3. Brand color migration

A scoped script converted Tailwind brand-blue utilities to sky:

- **780 replacements across 45 files** — `*-blue-<shade> → *-sky-<shade>` (matched only inside utility classes: `bg-`, `text-`, `border-`, `ring-`, `from-/via-/to-`, `fill-`, `stroke-`, etc., with any `hover:`/`dark:`/`focus:` prefix). Custom tokens like `shadow-glow-blue` were left intact.

Hardcoded hex/SVG colors the class migration can't reach were fixed by hand:

| File | Change |
|------|--------|
| `components/earnings_chart.jsx` | Recharts series `#2563eb → #0ea5e9` (6×). |
| `components/ServicesMap.jsx` | Available-provider marker `#2563eb → #0277bd`. |
| `contexts/LocationContext.jsx` | Background gradient retuned to a sky ramp (`#075985 → #0369a1 → #0ea5e9`). |
| `pages/home.jsx` | Hero radial-glow gradient retuned to sky + ember; light fallback `#eff6ff → #f0f9ff`. |
| `components/ImageUploadModal.jsx` | Decorative SVG rect `#93C5FD → #7dd3fc`. |

---

## 4. Accessibility — contrast tightening pass

Bright sky as a foreground/fill on white fails or skirts WCAG AA
(`sky-500` ≈ 2.6:1, `sky-600` ≈ 4.1:1; AA needs 4.5:1). A scoped script bumped
light-mode usages to AA-safe shades:

- **266 bumps across 39 files:**
  - `text-sky-600 → text-sky-700` (≈5.9:1)
  - `text-sky-500 → text-sky-700`
  - `bg-sky-600 → bg-sky-700`
  - `hover:bg-sky-700 → hover:bg-sky-800` (keeps hover darker than the new base)
- **Dark-mode `sky-400` variants were intentionally left untouched** (already high-contrast on dark surfaces).

> Note: the bright sky (`#0ea5e9`) is retained for accents, icons-on-tint,
> gradients, focus glows, and dark-mode text — where contrast is not a concern.

---

## 5. Per-page polish

| Page | Change |
|------|--------|
| `pages/home.jsx` | Service-icon tile hover `sky-300 → sky-600` (white icons were unreadable on hover). |
| `pages/home_sections.jsx` | Feature-icon gradient rainbow → on-brand sky→indigo; heavy resting `shadow-2xl` cards softened to `shadow-md / shadow-sm` + hairline rings; dark-mode inner circle fill. |
| `pages/Services.jsx` | Fixed a no-op "View all" hover (same shade as base) and added an arrow nudge on hover. |
| `pages/category.jsx` | Hero image overlay: flat black → branded `sky-950` gradient. |
| `pages/selected_service.jsx` | Hero overlay → `sky-950` gradient; filter card `rounded-2xl` + ring. |
| `pages/client_dashboard.jsx` | Provider-card avatar gradient → sky. |
| `pages/provider_dashboard.jsx` | "Top Performer" card gradient azure→purple → azure→indigo. |
| `pages/general_profilePage.jsx` | Profile + info cards `rounded-2xl` + rings; primary action button `rounded-xl` + glow; skill tags → pill chips with ring. |

---

## 6. Verification

- `npm run build` passes clean after every phase (no errors; only a pre-existing
  chunk-size advisory unrelated to this work).
- Compilation and dev-server boot were confirmed; **visual/browser QA across the
  four flows in light and dark mode is still recommended.**

## Notes / follow-ups
- The two migration scripts were one-off and removed after running.
- Tradeoff accepted: solid sky buttons sit at `sky-700` for AA, so they read as a
  deeper azure than pure `#0ea5e9`; brightness lives in tints, accents, and gradients.
