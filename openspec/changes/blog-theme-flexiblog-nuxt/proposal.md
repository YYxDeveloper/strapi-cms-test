# Proposal

## Why

The Nuxt frontend's blog uses LaunchPad's default look (tall image-over-text cards in a 3-column grid, masked hero image). The owner wants the blog to follow the FlexiBlog Agency theme (https://flexiblog-agency.netlify.app/) so blog pages read as a card-based, accent-led magazine layout.

## What Changes

- Add blog theme tokens (`#181a1b` card surface, `#67a0ea` accent, soft card shadow) to the Nuxt Tailwind theme.
- Restyle `ArticleCard` as a horizontal card: rounded thumbnail left, text right, 4px accent left border, 16px radius.
- Blog list grid goes from 3 columns to 2 columns on large screens.
- Article detail hero image becomes a plain 16px-rounded image (radial fade mask removed).
- Scope is **blog only** and **Nuxt only**; Next, Astro and TanStack are not touched.

## Capabilities

### New Capabilities
- `blog-theme`: visual theme contract for blog list cards and the article detail hero in the Nuxt frontend.

### Modified Capabilities

## Impact

- `nuxt/app/assets/css/global.css`, `nuxt/app/components/ArticleCard.vue`, `nuxt/app/components/views/ArticleView.vue`, `nuxt/app/pages/[locale]/blog/index.vue`.
- `ArticleCard` is also reused by related-article blocks, so those cards change shape too.
- No Strapi schema, API or route changes. One dev-only dependency is added at the repo root: `@playwright/test`, plus `playwright.config.ts` and `tests/e2e/blog-theme.spec.ts` for the E2E verification (tasks 2.1/2.2).
- **Parity note**: `AGENTS.md` asks for cross-frontend parity; this change intentionally diverges for Nuxt only, at the owner's request. Porting to the other three frontends is a possible follow-up.

## Regression Risk

- 低（UI / Template 調整）：視覺回歸檢查 `/en/blog`、`/fr/blog`、文章詳情頁、含 RelatedArticles 的頁面。

## Security Architecture

N/A（低風險變更）

## Security Gate（opsxx-review Phase 6a-S 預判）

- security-scan: required（永遠執行）
- security-review: skipped — 純樣式變更，無輸入/認證
- cso: skipped — 不涉及認證架構
- dependency-audit: required（永遠執行）

## Design Pattern Rationale

- 模組 blog-theme（樣式 token + 卡片元件）：不選用設計模式，理由：僅調整 Tailwind class 與主題變數，現有元件結構已足夠，套用模式屬過度設計；`ArticleCard` 已是單一重用元件，未出現 3 次重複邏輯，不需新抽取。

## Grill Gate

skipped（需求清楚、低風險）
