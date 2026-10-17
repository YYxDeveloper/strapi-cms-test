# Design

## Context

Nuxt 4 + Tailwind 4 (CSS-first `@theme` in `global.css`). Components reference semantic tokens, never raw hex (see the comment in `global.css`). `ArticleCard` is shared by the blog list and `RelatedArticles`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Match the FlexiBlog card look using semantic Tailwind tokens.
- Smallest possible diff: 4 files.

**Non-Goals:**
- Navbar, footer, homepage, product pages, light mode.
- The other three frontends.
- Copying the reference site's exact colors (its captured values were altered by a dark-mode browser extension).

## Decisions

- **Tokens in `@theme`** (`--color-blog-surface`, `--color-blog-accent`, `--shadow-blog-card`): keeps raw hex out of components, per the file's own convention. Alternative: inline arbitrary values; rejected as it breaks that convention.
- **Accent `#67a0ea`** is the owner-specified color (also the reference site's link color).
- **Edit `ArticleCard` in place** rather than adding a second card component: one use today, so no abstraction (Rule of Three).

## Risks / Trade-offs

- Related-article cards change shape too → check pages that render `RelatedArticles`.
- Nuxt diverges from the other frontends → documented in proposal; port later if wanted.
