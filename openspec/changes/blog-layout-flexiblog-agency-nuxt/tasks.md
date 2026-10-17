# Tasks

## 1. Implementation

- [ ] 1.1 Add a `variant` prop (`horizontal` | `featured` | `compact`, default `horizontal`) to `nuxt/app/components/ArticleCard.vue`; verify `RelatedArticles` cards still render horizontally
- [ ] 1.2 Implement the `featured` (2:1 image on top) and `compact` (4:3 image on top) templates using existing `blog-*` tokens; verify `cd nuxt && yarn build` succeeds
- [ ] 1.3 Update `nuxt/app/pages/[locale]/blog/index.vue`: first article as featured card, rest in a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` grid; handle 0 / 1 article; verify the build succeeds
- [ ] 1.4 Add a category chip row to `blog/index.vue`: "All" + chips from the loaded articles' categories, active state via `route.query.category`, articles filtered by that query; verify unknown/empty category falls back to all and the build succeeds

## 2. Verification

- [ ] 2.1 Write and run a headless Playwright test starting from the real entry point (nav → blog list → article), with full-page scroll (down 2s, up 2s); assert the featured card, compact cards and category chip filtering (click a chip → URL gets `?category=`, list narrows); verify it passes
- [ ] 2.2 Run the same test headed; verify it passes (no webm recording requested)
- [ ] 2.3 Check `/en/blog`, `/fr/blog` and an article page with RelatedArticles at `http://100.100.177.73:3001`; verify no layout breakage

## Workflow follow-up

- Review, commit (Conventional Commit) and push after verification.
