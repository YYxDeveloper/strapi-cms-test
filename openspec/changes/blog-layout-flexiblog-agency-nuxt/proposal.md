# Proposal

## Why

The Nuxt `/blog` list is a flat two-column grid of identical horizontal cards. The owner wants the list layout to follow the FlexiBlog Agency homepage (https://flexiblog-agency.netlify.app/): one large featured post on top, followed by a grid of smaller image-led cards.

## What Changes

- The newest article renders as a full-width **featured card**: wide 2:1 image, category chips, title, description, date.
- The remaining articles render as **compact cards** (image on top at ~4:3, category chip, title, date) in a 1 / 2 / 3 column grid (`base` / `sm` / `lg`).
- `ArticleCard` gains a `variant` prop (`horizontal` default, `featured`, `compact`); the existing horizontal card stays for `RelatedArticles`.
- A **category filter chip row** above the featured card: an "All" chip plus one text-only chip per Strapi category, active chip underlined in `#67a0ea`. Chips link to `/[locale]/blog?category=<slug>` and the existing page filters by the `category` query. No new route and no icons.
- Existing blog theme tokens (`#67a0ea` accent, white card surface, `.blog-light` scope) are reused; no new colors.
- Scope is **blog list only** and **Nuxt only**.

## Capabilities

### New Capabilities

### Modified Capabilities
- `blog-theme`: the "Two-column blog grid" requirement is replaced by a featured-plus-grid list layout; featured and compact card variants are added.

## Impact

- `nuxt/app/pages/[locale]/blog/index.vue`, `nuxt/app/components/ArticleCard.vue`; possibly small additions to `nuxt/app/assets/css/global.css`.
- `RelatedArticles` keeps the horizontal card, so article detail pages are unaffected.
- No Strapi schema, API or route changes. `Article` has no author or reading-time field, so the meta line shows the date only.
- **Out of scope** (would need new routes, schema or content): icon-based category nav, per-category sections with "View More", promo banner, newsletter block.
- **Parity note**: `AGENTS.md` asks for cross-frontend parity; this change intentionally diverges for Nuxt only, as in the previous blog-theme change. Porting to next / astro / tanstack is a possible follow-up.

## Regression Risk

- 低（UI / Template 調整）：視覺回歸檢查 `/en/blog`、`/fr/blog`（含 0 / 1 / 2 篇文章的邊界情況）、含 RelatedArticles 的文章頁。

## Security Architecture

N/A（低風險變更）

## Security Gate（opsxx-review Phase 6a-S 預判）

- security-scan: required（永遠執行）
- security-review: skipped — 純樣式與版面變更，無輸入/認證
- cso: skipped — 不涉及認證架構
- dependency-audit: required（永遠執行）

## Design Pattern Rationale

- 模組 blog-list-layout（`index.vue` 版面 + `ArticleCard` variant）：不選用設計模式，理由：只有三種外觀差異，以 `variant` prop 加 class 對照即可；拆成 Strategy 或三個元件屬過度設計（Over-Engineering），且三者共用同一份資料與連結邏輯，未出現 3 次重複邏輯，不符合 Rule of Three。

## Grill Gate

skipped（低風險）。使用者未逐條回覆確認問題，直接執行 `/opsxx-create`，故採用預設方案：只做 Nuxt、不改 schema、精選文章取最新一篇、不含分類分區與促銷／訂閱區塊。
