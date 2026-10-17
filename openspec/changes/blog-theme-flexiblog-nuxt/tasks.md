# Tasks

## 1. Theme tokens and components

- [x] 1.1 Add `--color-blog-surface`, `--color-blog-accent`, `--shadow-blog-card` to `nuxt/app/assets/css/global.css`; verify `cd nuxt && yarn build` succeeds
- [x] 1.2 Rework `ArticleCard.vue` into a horizontal accent card; verify `/en/blog` HTML contains `border-l-blog-accent`
- [x] 1.3 Switch blog list grid to `lg:grid-cols-2` in `pages/[locale]/blog/index.vue`; verify build succeeds
- [x] 1.4 Remove the radial mask and use `rounded-2xl` on the hero in `ArticleView.vue`; verify build succeeds

## 2. Verification

- [ ] 2.1 Write and run a headless Playwright test starting from the real entry point (nav → blog list → article), with full-page scroll (down 2s, up 2s); verify it passes
- [ ] 2.2 Run the same test headed; verify it passes (no webm recording requested)
- [ ] 2.3 Check `/en/blog`, `/fr/blog`, an article page and a page with RelatedArticles at `http://100.100.177.73:3001`; verify no layout breakage

## Workflow follow-up

- Review, commit (Conventional Commit) and push after verification.
