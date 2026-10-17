import { type Locator, type Page, expect, test } from '@playwright/test';

const LOCALES = ['en', 'fr'] as const;

const ACCENT = 'rgb(103, 160, 234)';
const SURFACE = 'rgb(255, 255, 255)';
const PAGE_BG = 'rgb(244, 246, 248)';

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

/** Reads a locator's computed `aspect-ratio` as a decimal number. */
async function aspectRatioOf(locator: Locator) {
  const value = await locator.evaluate(
    (el) => getComputedStyle(el).aspectRatio
  );
  const [width, height] = value.split('/').map((part) => parseFloat(part));
  return width / height;
}

/** Number of CSS grid tracks on an element's parent. */
async function gridColumns(locator: Locator) {
  return locator.evaluate(
    (el) =>
      getComputedStyle(el.parentElement as HTMLElement)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length
  );
}

for (const locale of LOCALES) {
  test(`[${locale}] nav -> blog list shows featured + compact cards and category filtering`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const navBlog = page.locator(`nav a[href="/${locale}/blog"]`).first();
    await expect(navBlog).toBeVisible();
    await navBlog.click();

    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/?$`));

    const scope = page.locator('.blog-light').first();
    await expect(scope).toBeVisible();
    expect(
      await scope.evaluate((el) => getComputedStyle(el).backgroundColor)
    ).toBe(PAGE_BG);

    // Category chip row: "All" active by default, plus one chip per category.
    const chips = page.getByTestId('category-chip');
    expect(await chips.count()).toBeGreaterThanOrEqual(2);
    const activeChip = page.locator(
      '[data-testid="category-chip"][data-active="true"]'
    );
    await expect(activeChip.first()).toHaveText(/^\s*All\s*$/i);

    // One full-width featured card with a 2:1 image on top.
    const featured = page.locator('a[data-variant="featured"]');
    await expect(featured).toHaveCount(1);
    await expect(featured).toBeVisible();
    expect(await aspectRatioOf(featured.locator('> div').first())).toBeCloseTo(
      2,
      1
    );

    // The remaining articles are compact cards with a 4:3 image on top.
    const compact = page.locator('a[data-variant="compact"]');
    expect(await compact.count()).toBeGreaterThan(0);
    await expect(compact.first()).toBeVisible();
    expect(
      await aspectRatioOf(compact.first().locator('> div').first())
    ).toBeCloseTo(4 / 3, 1);

    // Featured spans the row; compact cards sit in a three-column grid at lg.
    const featuredBox = await featured.boundingBox();
    const compactBox = await compact.first().boundingBox();
    expect(featuredBox!.width).toBeGreaterThan(compactBox!.width);
    expect(await gridColumns(compact.first())).toBe(3);

    // The shared blog card theme still applies (white surface, 16px radius).
    const compactStyle = await compact.first().evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        borderRadius: style.borderTopLeftRadius,
        backgroundColor: style.backgroundColor,
      };
    });
    expect(compactStyle.borderRadius).toBe('16px');
    expect(compactStyle.backgroundColor).toBe(SURFACE);

    await fullPageScroll(page);

    // Clicking a category chip narrows the list and marks the chip active.
    const totalBefore = await page.locator('a[data-variant]').count();
    const categoryChip = page
      .locator('[data-testid="category-chip"][href*="category="]')
      .first();
    const categoryHref = (await categoryChip.getAttribute('href')) as string;
    const categorySlug = new URL(categoryHref, 'http://x').searchParams.get(
      'category'
    ) as string;
    await categoryChip.click();
    await expect(page).toHaveURL(
      new RegExp(`category=${encodeURIComponent(categorySlug)}`)
    );
    await expect(categoryChip).toHaveAttribute('data-active', 'true');
    expect(
      await categoryChip.evaluate(
        (el) => getComputedStyle(el).borderBottomColor
      )
    ).toBe(ACCENT);
    await expect(page.locator('a[data-variant="featured"]')).toHaveCount(1);
    expect(await page.locator('a[data-variant]').count()).toBeLessThanOrEqual(
      totalBefore
    );

    // The "All" chip restores the whole list.
    const allChip = page.locator(
      `[data-testid="category-chip"][href="/${locale}/blog"]`
    );
    await allChip.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/?$`));
    expect(
      await page.locator('a[data-variant="compact"]').count()
    ).toBeGreaterThan(0);

    // Unknown category falls back to all articles with "All" active.
    await page.goto(`/${locale}/blog?category=does-not-exist`);
    await expect(page.locator('a[data-variant="featured"]')).toHaveCount(1);
    await expect(
      page.locator('[data-testid="category-chip"][data-active="true"]').first()
    ).toHaveText(/^\s*All\s*$/i);

    // Featured card leads to the article; RelatedArticles stays horizontal.
    await page.goto(`/${locale}/blog`);
    await page.locator('a[data-variant="featured"]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/blog/.+`));

    const horizontal = page.locator(
      'a[data-variant="horizontal"].border-l-blog-accent'
    );
    await expect(horizontal.first()).toBeVisible();

    const hero = page.locator('img.aspect-square.rounded-2xl').first();
    await expect(hero).toBeVisible();
    const heroStyle = await hero.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        borderRadius: style.borderTopLeftRadius,
        maskImage: style.maskImage || style.webkitMaskImage,
      };
    });
    expect(heroStyle.borderRadius).toBe('16px');
    expect(['none', '']).toContain(heroStyle.maskImage);

    await fullPageScroll(page);
  });

  test(`[${locale}] every category view keeps one featured card (1-article lists render no grid)`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/blog`);
    const hrefs = await page
      .locator('[data-testid="category-chip"][href*="category="]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') as string));
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      await page.goto(href);
      await expect(page.locator('a[data-variant="featured"]')).toHaveCount(1);
      const compactCount = await page
        .locator('a[data-variant="compact"]')
        .count();
      if (compactCount === 0) {
        await expect(page.locator('.grid.lg\\:grid-cols-3')).toHaveCount(0);
      }
    }
  });

  test(`[${locale}] compact cards reflow 1 / 2 / 3 columns across breakpoints`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/blog`);

    const compact = page.locator('a[data-variant="compact"]').first();
    await expect(compact).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(() => gridColumns(compact)).toBe(3);

    await page.setViewportSize({ width: 800, height: 900 });
    await expect.poll(() => gridColumns(compact)).toBe(2);

    await page.setViewportSize({ width: 400, height: 900 });
    await expect.poll(() => gridColumns(compact)).toBe(1);
  });
}
