# Design

## Context

Nuxt 4 + Tailwind 4. `ArticleCard` is used by the blog list and `RelatedArticles`. Blog tokens (`--color-blog-*`, `--shadow-blog-card`) and the `.blog-light` scope already exist from the previous change. See proposal.md.

## Goals / Non-Goals

**Goals:**
- Featured + grid list layout like the reference site, with minimal diff (2 files).
- Reuse existing tokens; no raw hex in components.

**Non-Goals:**
- Category nav, category sections, promo/newsletter blocks, author/reading time.
- Strapi schema changes, the other three frontends.

## Decisions

- **`variant` prop on `ArticleCard`** (`horizontal` | `featured` | `compact`), default `horizontal`: keeps `RelatedArticles` unchanged and avoids three near-identical components (shared link, date formatting, reveal animation). Alternative: separate components; rejected for duplication.
- **Featured = first item of the existing `publishedAt:desc` list** (`articles[0]`), the rest via `articles.slice(1)`. No Strapi flag needed. Alternative: a Strapi `featured` field; rejected to avoid a schema change.
- **Category chips filter by query, not by route**: chips come from the categories of the loaded articles (`Category` only has `name`, so the slug is derived from it), the active chip is read from `route.query.category`, and the article list is filtered client-side of the fetch. Alternative: a `/blog/category/[slug]` route; rejected as heavier (new route, extra fetch) for the simplified scope.
- **Edge cases**: 0 articles keeps the existing empty message; 1 article shows only the featured card; an unknown `category` query falls back to all articles; the grid is omitted when the rest is empty.
- **Images**: featured uses `aspect-[2/1]`, compact uses `aspect-[4/3]`, both with `object-cover`; widths passed to `StrapiMedia` sized for each.

## Risks / Trade-offs

- Newest article is always featured, which may not be the editor's choice → a `featured` field can be added later.
- Nuxt diverges from the other frontends → documented in proposal.

## Design Pattern Rationale

- 見 proposal.md：不選用設計模式（variant prop 已足夠）。
