import { type Page, expect, test } from '@playwright/test';

const LOCALES = ['en', 'fr'] as const;

const ACCENT = 'rgb(103, 160, 234)';
const SURFACE = 'rgb(24, 26, 27)';

/** Scrolls the window to an absolute Y position over `durationMs` (eased). */
async function smoothScroll(page: Page, to: number, durationMs: number) {
  await page.evaluate(
    ({ to, durationMs }) =>
      new Promise<void>((resolve) => {
        const start = window.scrollY;
        const t0 = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - t0) / durationMs, 1);
          window.scrollTo(0, start + (to - start) * progress);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(tick);
      }),
    { to, durationMs }
  );
}

/** Full-page scroll: top -> bottom (2s), bottom -> top (2s). */
async function fullPageScroll(page: Page) {
  const bottom = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight
  );
  await smoothScroll(page, bottom, 2000);
  await page.waitForTimeout(150);
  await smoothScroll(page, 0, 2000);
}

for (const locale of LOCALES) {
  test(`[${locale}] nav -> blog list -> article keeps the FlexiBlog card theme`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const navBlog = page.locator(`nav a[href="/${locale}/blog"]`).first();
    await expect(navBlog).toBeVisible();
    await navBlog.click();

    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/?$`));

    const cards = page.locator('a.border-l-blog-accent');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);

    const card = cards.first();
    const cardStyle = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        borderLeftWidth: s.borderLeftWidth,
        borderLeftColor: s.borderLeftColor,
        borderRadius: s.borderTopLeftRadius,
        backgroundColor: s.backgroundColor,
      };
    });
    expect(cardStyle.borderLeftWidth).toBe('4px');
    expect(cardStyle.borderLeftColor).toBe(ACCENT);
    expect(cardStyle.borderRadius).toBe('16px');
    expect(cardStyle.backgroundColor).toBe(SURFACE);

    const columns = await card.evaluate(
      (el) =>
        getComputedStyle(el.parentElement as HTMLElement)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length
    );
    expect(columns).toBe(2);

    await fullPageScroll(page);

    await card.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/.+`));

    const hero = page.locator('img.aspect-square.rounded-2xl').first();
    await expect(hero).toBeVisible();

    const heroStyle = await hero.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        borderRadius: s.borderTopLeftRadius,
        maskImage: s.maskImage || s.webkitMaskImage,
      };
    });
    expect(heroStyle.borderRadius).toBe('16px');
    expect(['none', '']).toContain(heroStyle.maskImage);

    await fullPageScroll(page);
  });
}
