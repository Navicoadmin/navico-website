import { prisma } from "@/lib/prisma";
import type { Category, Product } from "@/lib/data";

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
    const where: Record<string, unknown> = { published: true };
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
          include: { category: true },
          orderBy: { name: "asc" },
    });
    return rows.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          code: p.code,
          categorySlug: p.category.slug,
          shortDescription: p.shortDescription,
          badge: undefined,
          tagline: undefined,
          activeIngredients: [],
          benefits: [],
          dosage: [],
          usageNote: p.usageInstructions ?? undefined,
          warningNote: undefined,
          heroImage: p.heroImage ?? undefined,
          gallery: (p.gallery as string[]) ?? [],
          subBrandLogo: p.subBrandLogo ?? undefined,
          metaTitle: p.metaTitle ?? undefined,
          metaDescription: p.metaDescription ?? undefined,
          featured: p.featured ?? false,
          faqs: p.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    }));
}

export async function getProductBySlugFromDB(slug: string): Promise<Product | undefined> {
    const p = await prisma.product.findUnique({
          where: { slug },
          include: { category: true, faqs: { orderBy: { id: "asc" } } },
    });
    if (!p) return undefined;
    return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          code: p.code,
          categorySlug: p.category.slug,
          shortDescription: p.shortDescription,
          badge: undefined,
          tagline: undefined,
          activeIngredients: [],
          benefits: [],
          dosage: [],
          usageNote: p.usageInstructions ?? undefined,
          warningNote: undefined,
          heroImage: p.heroImage ?? undefined,
          gallery: (p.gallery as string[]) ?? [],
          subBrandLogo: p.subBrandLogo ?? undefined,
          metaTitle: p.metaTitle ?? undefined,
          metaDescription: p.metaDescription ?? undefined,
          featured: p.featured ?? false,
          faqs: p.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    };
}

export async function getRelatedProductsFromDB(
    product: Product,
    limit = 3
  ): Promise<Product[]> {
    const rows = await prisma.product.findMany({
          where: {
                  published: true,
                  NOT: { id: product.id },
                  category: { slug: product.categorySlug },
          },
          include: { category: true },
          take: limit,
          orderBy: { name: "asc" },
    });
    return rows.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          code: p.code,
          categorySlug: p.category.slug,
          shortDescription: p.shortDescription,
          badge: undefined,
          tagline: undefined,
          activeIngredients: [],
          benefits: [],
          dosage: [],
          usageNote: p.usageInstructions ?? undefined,
          warningNote: undefined,
          heroImage: p.heroImage ?? undefined,
          gallery: (p.gallery as string[]) ?? [],
          subBrandLogo: p.subBrandLogo ?? undefined,
          metaTitle: p.metaTitle ?? undefined,
          metaDescription: p.metaDescription ?? undefined,
          featured: p.featured ?? false,
          faqs: p.faqs?.map((f) => ({ question: f.question, answer: f.answer })) ?? [],
    }));
}
