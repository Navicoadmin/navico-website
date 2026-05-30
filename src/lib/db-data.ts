import { prisma } from "@/lib/prisma";
import type { Category, Product, News } from "@/lib/data";
import type { Prisma } from "@prisma/client";

// Helper: map a Prisma product row + included relations to the Product frontend type
type PrismaProduct = Prisma.ProductGetPayload<{
  include: { category: true; faqs: true };
}>;

function mapProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    categorySlug: p.category.slug,
    shortDescription: p.shortDescription,
    badge: undefined,
    tagline: undefined,
    activeIngredients: p.activeIngredients
      ? p.activeIngredients.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    benefits: p.benefits
      ? p.benefits.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    dosage: [],
    usageNote: p.usageInstructions ?? undefined,
    warningNote: undefined,
    heroImage: p.heroImage ?? "",
    gallery: p.gallery,
    faqs: p.faqs
      .sort((a, b) => a.order - b.order)
      .map((f) => ({ question: f.question, answer: f.answer })),
    featured: p.featured,
  };
}

// ====== Category functions ======

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

// ====== Product functions ======

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
    include: { category: true, faqs: true },
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getProductBySlugFromDB(
  slug: string
): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, faqs: true },
  });
  if (!p) return undefined;
  return mapProduct(p);
}

export async function getRelatedProductsFromDB(
  product: Product,
  limit = 3
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      published: true,
      category: { slug: product.categorySlug },
      NOT: { slug: product.slug },
    },
    include: { category: true, faqs: true },
    take: limit,
  });
  return rows.map(mapProduct);
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

export async function getNewsBySlugFromDB(
  slug: string
): Promise<News | undefined> {
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
