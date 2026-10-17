<script setup lang="ts">
import { formatDate } from '#shared/lib/i18n';
import type { Article } from '#shared/types/strapi';

type ArticleCardVariant = 'horizontal' | 'featured' | 'compact';

const props = withDefaults(
  defineProps<{
    article: Article;
    locale: string;
    delay?: number;
    variant?: ArticleCardVariant;
  }>(),
  { delay: 0, variant: 'horizontal' }
);

const published = computed(() =>
  formatDate(props.article.publishedAt, props.locale)
);
</script>

<template>
  <NuxtLink
    :to="`/${locale}/blog/${article.slug}`"
    :data-variant="variant"
    data-reveal
    :style="`--reveal-delay: ${delay}ms`"
    :class="[
      'group shadow-blog-card bg-blog-surface overflow-hidden transition duration-200 hover:-translate-y-0.5',
      variant === 'horizontal'
        ? 'border-l-blog-accent flex flex-row items-stretch gap-4 rounded-2xl border-l-4 p-3'
        : 'flex flex-col rounded-2xl',
    ]"
  >
    <template v-if="variant === 'horizontal'">
      <div
        class="aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl bg-blog-thumb sm:w-36"
      >
        <StrapiMedia
          v-if="article.image"
          :media="article.image"
          :alt="article.title"
          :width="400"
          :height="533"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div class="flex min-w-0 flex-1 flex-col py-2 pr-2">
        <div
          v-if="article.categories?.length"
          class="mb-3 flex flex-wrap gap-2"
        >
          <span
            v-for="category in article.categories"
            :key="category.name"
            class="text-muted rounded-full bg-blog-chip px-2 py-1 text-xs font-bold capitalize"
          >
            {{ category.name }}
          </span>
        </div>
        <h3
          class="text-base font-semibold text-blog-title transition group-hover:text-blog-title-hover md:text-lg"
        >
          {{ article.title }}
        </h3>
        <p
          v-if="article.description"
          class="text-muted mt-2 line-clamp-3 text-sm"
        >
          {{ article.description }}
        </p>
        <time v-if="published" class="mt-4 text-xs text-neutral-500">
          {{ published }}
        </time>
      </div>
    </template>

    <template v-else-if="variant === 'featured'">
      <div class="aspect-[2/1] w-full overflow-hidden bg-blog-thumb">
        <StrapiMedia
          v-if="article.image"
          :media="article.image"
          :alt="article.title"
          :width="1200"
          :height="600"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div class="flex flex-col p-6 md:p-8">
        <div
          v-if="article.categories?.length"
          class="mb-3 flex flex-wrap gap-2"
        >
          <span
            v-for="category in article.categories"
            :key="category.name"
            class="text-muted rounded-full bg-blog-chip px-2 py-1 text-xs font-bold capitalize"
          >
            {{ category.name }}
          </span>
        </div>
        <h3
          class="text-2xl font-semibold text-blog-title transition group-hover:text-blog-title-hover md:text-3xl"
        >
          {{ article.title }}
        </h3>
        <p
          v-if="article.description"
          class="text-muted mt-3 line-clamp-3 text-base"
        >
          {{ article.description }}
        </p>
        <time v-if="published" class="mt-4 text-xs text-neutral-500">
          {{ published }}
        </time>
      </div>
    </template>

    <template v-else>
      <div class="aspect-[4/3] w-full overflow-hidden bg-blog-thumb">
        <StrapiMedia
          v-if="article.image"
          :media="article.image"
          :alt="article.title"
          :width="600"
          :height="450"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div class="flex flex-1 flex-col p-5">
        <span
          v-if="article.categories?.length"
          class="text-muted mb-2 inline-block w-fit rounded-full bg-blog-chip px-2 py-1 text-xs font-bold capitalize"
        >
          {{ article.categories?.[0]?.name }}
        </span>
        <h3
          class="text-base font-semibold text-blog-title transition group-hover:text-blog-title-hover md:text-lg"
        >
          {{ article.title }}
        </h3>
        <time v-if="published" class="mt-3 text-xs text-neutral-500">
          {{ published }}
        </time>
      </div>
    </template>
  </NuxtLink>
</template>
