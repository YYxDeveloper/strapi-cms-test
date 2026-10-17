<script setup lang="ts">
import type { Article } from '#shared/types/strapi';

const route = useRoute();
assertLocale(String(route.params.locale));

const locale = useLocale();
const strapi = useStrapiClient();

const { data: articles } = await useAsyncData(
  computed(() => `articles-${locale.value}`),
  () =>
    strapi.collection<Article>('articles', {
      locale: locale.value,
      sort: 'publishedAt:desc',
    }),
  { watch: [locale], default: () => [] }
);

const { data: blogPage } = await useIndexPage('blog-page', locale);
const { data: global } = await useGlobal(locale);

useLaunchpadSeo({
  seo: computed(() => blogPage.value?.seo),
  global,
  locale,
});

const categorySlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || name.toLowerCase();

const categories = computed(() => {
  const bySlug = new Map<string, string>();
  for (const article of articles.value ?? []) {
    for (const category of article.categories ?? []) {
      const slug = categorySlug(category.name);
      if (!bySlug.has(slug)) {
        bySlug.set(slug, category.name);
      }
    }
  }
  return [...bySlug.entries()].map(([slug, name]) => ({ slug, name }));
});

const activeCategory = computed(() => {
  const query = route.query.category;
  const value = Array.isArray(query) ? query[0] : query;
  if (typeof value !== 'string' || value === '') {
    return 'all';
  }
  return categories.value.some((category) => category.slug === value)
    ? value
    : 'all';
});

const visibleArticles = computed(() => {
  const all = articles.value ?? [];
  if (activeCategory.value === 'all') {
    return all;
  }
  return all.filter((article) =>
    (article.categories ?? []).some(
      (category) => categorySlug(category.name) === activeCategory.value
    )
  );
});

const featured = computed(() => visibleArticles.value[0]);
const rest = computed(() => visibleArticles.value.slice(1));

const chipClass = (slug: string) =>
  activeCategory.value === slug
    ? 'text-blog-title border-b-2 border-blog-accent'
    : 'text-muted border-b-2 border-transparent transition hover:text-blog-title';
</script>

<template>
  <div class="blog-light relative overflow-hidden pt-40 pb-20">
    <AmbientColor />
    <Container class="relative z-10">
      <Heading data-reveal>{{ blogPage?.heading ?? 'Blog' }}</Heading>
      <Subheading v-if="blogPage?.sub_heading" class="mt-4" data-reveal>
        {{ blogPage.sub_heading }}
      </Subheading>

      <template v-if="articles?.length">
        <nav
          class="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          data-testid="category-chips"
        >
          <NuxtLink
            :to="`/${locale}/blog`"
            data-testid="category-chip"
            :data-active="activeCategory === 'all'"
            class="pb-1 text-sm font-semibold capitalize"
            :class="chipClass('all')"
          >
            All
          </NuxtLink>
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/${locale}/blog?category=${category.slug}`"
            data-testid="category-chip"
            :data-active="activeCategory === category.slug"
            class="pb-1 text-sm font-semibold capitalize"
            :class="chipClass(category.slug)"
          >
            {{ category.name }}
          </NuxtLink>
        </nav>

        <ArticleCard
          v-if="featured !== undefined"
          :article="featured"
          :locale="locale"
          variant="featured"
          class="mt-10"
        />

        <div
          v-if="rest.length > 0"
          class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <ArticleCard
            v-for="(article, index) in rest"
            :key="article.documentId"
            :article="article"
            :locale="locale"
            variant="compact"
            :delay="index * 80"
          />
        </div>
      </template>
      <p v-else class="text-muted mt-16 text-center">No articles yet.</p>
    </Container>
  </div>
</template>
