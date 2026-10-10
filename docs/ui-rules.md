# UI quality rules (Svels-client) — mandatory for every PR that touches markup or styles

## 1. Spacing & sizes
- Only the 4/8 scale: --space-1=4px, --space-2=8px, --space-3=12px, --space-4=16px, --space-5=20px, --space-6=24px, --space-8=32px, --space-10=40px. No other margin/padding/gap values (0 and 1px borders are fine).
- Control heights: --control-h-sm=36px, --control-h-md=44px, --control-h-lg=52px. Tap target >= 44px.
- Radii: --radius-sm=8px, --radius-md=12px, --radius-lg=16px, --radius-xl=24px, --radius-pill=999px — or the venue tokens --rs-btn-radius / --rs-card-radius / --rs-media-radius (prefer venue tokens in guest UI).
- Colours only via --rs-* (guest/venue UI) or tokens. Hex/rgb literals are forbidden in feature scss (allowed only in token/theme files).
- z-index only via --z-base(0), --z-sticky(10), --z-header(20), --z-dropdown(30), --z-sheet(40), --z-modal(50), --z-toast(60).
- Font sizes: --text-xs=12px, --text-sm=14px, --text-md=16px, --text-lg=18px, --text-xl=20px, --text-2xl=24px; line-heights 1.25 (titles) / 1.45 (body). Weights 400/500/600/700 only.

## 2. Layout
- Spacing between siblings is set by the PARENT with `gap` (Stack/Cluster/grid). Margins on children are forbidden (except margin-inline: auto). No `:last-child { margin: 0 }`, no `--flush` modifiers.
- Cards/rows have inner padding --space-3 or --space-4 on ALL sides. Content never touches borders or dividers.
- Modal / header titles are centered with a `1fr auto 1fr` grid (or equal fixed side slots); left and right slots have equal width.
- Text that may overflow: `min-width: 0` + ellipsis or wrapping. No fixed px widths for text.
- Icons align to text with `display:inline-flex; align-items:center`; icon sizes 16/20/24px.

## 3. Shared primitives only (`src/shared/ui`)
Modal, Sheet, SegmentedControl, Button, IconButton, Field, Input, Select, Textarea, Checkbox, Stack, Cluster, Skeleton, PageTitle, VenueHeader.

| Primitive | Import example |
| --- | --- |
| Modal / Sheet | `import { Modal, Sheet } from '@/shared/ui'` |
| SegmentedControl | `import { SegmentedControl } from '@/shared/ui'` |
| Button / IconButton | `import { Button, IconButton } from '@/shared/ui'` |
| Field + inputs | `import { Field, Input, Textarea, Select, Checkbox } from '@/shared/ui'` |
| Layout | `import { Stack, Cluster } from '@/shared/ui'` |
| Loading / titles | `import { Skeleton, SkeletonList, PageTitle } from '@/shared/ui'` |

- Need a variant → add a prop to the primitive; do not write a local copy or local overrides.
- Modals: backdrop click, Escape and × close, focus trap, focus return, scroll lock — all come from Modal/Sheet.
- A choice of 2–4 options = SegmentedControl. More than 4 = Select or chips. Two separate buttons acting as a switch are forbidden.
- A new header or a hand-written modal in a PR = rejected in review.

## 4. Mobile-first
- Build for 360 first, then 390, 768, 1280. Media queries only `min-width` (breakpoints: 480, 768, 1024, 1280).
- No horizontal scroll at 360. Respect safe-area insets for sticky/fixed elements.

## 5. Loading
- Every page renders content or a layout-matching Skeleton in the first HTML. "Загрузка…" texts and empty screens are forbidden.
- The venue header does not depend on auth and does not remount between venue pages (shared layout).

## 6. Verification (mandatory in PR)
- Playwright `toHaveScreenshot` for changed screens at 360/390/768/1280 (guest pages: themes classic + midnight + warm), baselines committed, `maxDiffPixelRatio: 0.01`, animations disabled.
- Attach before/after screenshots at 390 and 1280 to the PR.
- Checklist (copy into PR body and tick):
  [ ] tokens only (no hex, no px/rem outside the scale)
  [ ] gap only, no margins on children
  [ ] shared primitives used, no local copies
  [ ] modal closes by backdrop, Escape and ×; focus returns
  [ ] titles centered, content has padding from borders/dividers
  [ ] 360 has no horizontal scroll, tap targets >= 44px
  [ ] skeleton instead of "Загрузка…"
  [ ] toHaveScreenshot green, screenshots in PR
