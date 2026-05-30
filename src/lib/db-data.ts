import { prisma } from "@/lib/prisma";
import type { Category, Product, News } from "@/lib/data";
import type { Prisma } from "@prisma/client";

// ====== Async Prisma-based data accessors (replaces hardcoded data.ts) ======

export async function getCategoriesFromDB(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    icon: c.icon ?? "",
  }));
}

export async function getProductsFromDB(opts?: {
  categorySlug?: string;
  query?: string;
}): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = { published: true };
  if (opts?.categorySlug) {
    where.category = { slug: opts.categorySlug };
  }
  if (opts?.query) {
    where.OR = [
      { name: { contains: opts.query, mode: "insensitive" } },
      { shortDescription: { contains: opts.query, mode: "insensitive" } },
    ];
  }
  const rows = await prisma.product.findMany({
    where,
    include: { faqs: true },
    orderBy: { name: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    categorySlug: p.categorySlug,
    shortDescription: p.shortDescription,
    badge: p.badge ?? undefined,
    tagline: p.tagline ?? undefined,
    activeIngredients: p.activeIngredients as string[],
    benefits: p.benefits as string[],
    dosage: p.dosage as { stage: string; dose: string; frequency: string; warning?: string }[],
    usageNote: p.usageNote ?? undefined,
    warningNote: p.warningNote ?? undefined,
    heroImage: p.heroImage ?? "",
    gallery: p.gallery as string[],
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    featured: p.featured,
  }));
}

export async function getProductBySlugFromDB(
  slug: string
): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { faqs: true },
  });
  if (!p) return undefined;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    categorySlug: p.categorySlug,
    shortDescription: p.shortDescription,
    badge: p.badge ?? undefined,
    tagline: p.tagline ?? undefined,
    activeIngredients: p.activeIngredients as string[],
    benefits: p.benefits as string[],
    dosage: p.dosage as { stage: string; dose: string; frequency: string; warning?: string }[],
    usageNote: p.usageNote ?? undefined,
    warningNote: p.warningNote ?? undefined,
    heroImage: p.heroImage ?? "",
    gallery: p.gallery as string[],
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    featured: p.featured,
  };
}

export async function getRelatedProductsFromDB(
  product: Product,
  limit = 3
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      published: true,
      categorySlug: product.categorySlug,
      NOT: { slug: product.slug },
    },
    include: { faqs: true },
    take: limit,
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    categorySlug: p.categorySlug,
    shortDescription: p.shortDescription,
    badge: p.badge ?? undefined,
    tagline: p.tagline ?? undefined,
    activeIngredients: p.activeIngredients as string[],
    benefits: p.benefits as string[],
    dosage: p.dosage as { stage: string; dose: string; frequency: string; warning?: string }[],
    usageNote: p.usageNote ?? undefined,
    warningNote: p.warningNote ?? undefined,
    heroImage: p.heroImage ?? "",
    gallery: p.gallery as string[],
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    featured: p.featured,
  }));
}

// ====== News functions ======

export async function getNewsListFromDB(opts?: {
  tag?: string;
  query?: string;
  limit?: number;
}): Promise<News[]> {
  const where: Prisma.NewsWhereInput = { published: true };
  if (opts?.tag) {
    where.tag = opts.tag;
  }
  if (opts?.query) {
    where.OR = [
      { title: { contains: opts.query, mode: "insensitive" } },
      { excerpt: { contains: opts.query, mode: "insensitive" } },
    ];
  }
  const rows = await prisma.news.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: opts?.limit,
  });
  return rows.map((n) => ({
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    content: n.content,
    coverImage: n.coverImage ?? undefined,
    tag: n.tag ?? undefined,
    author: n.author,
    views: n.views,
    publishedAt: n.publishedAt.toISOString(),
  }));
}

export async function getTrendingNewsFromDB(limit = 3): Promise<News[]> {
  const rows = await prisma.news.findMany({
    where: { published: true },
    orderBy: { views: "desc" },
    take: limit,
  });
  return rows.map((n) => ({
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    content: n.content,
    coverImage: n.coverImage ?? undefined,
    tag: n.tag ?? undefined,
    author: n.author,
    views: n.views,
    publishedAt: n.publishedAt.toISOString(),
  }));
}

export async function getNewsBySlugFromDB(slug: string): Promise<News | undefined> {
  const n = await prisma.news.findUnique({ where: { slug } });
  if (!n) return undefined;
  return {
    title: n.title,
    slug: n.slug,
    excerpt: n.excerpt,
    content: n.content,
    coverImage: n.coverImage ?? undefined,
    tag: n.tag ?? undefined,
    author: n.author,
    views: n.views,
    publishedAt: n.publishedAt.toISOString(),
  };
}
