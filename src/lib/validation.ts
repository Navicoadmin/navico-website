import { z } from "zod";

// ====== Schema xác thực dữ liệu đầu vào (zod) ======

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  email: z.string().trim().email("Email không hợp lệ").max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+()\s.-]*$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Nội dung quá ngắn").max(2000),
});

const faqSchema = z.object({
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(2000),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  icon: z.string().trim().max(60).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  code: z.string().trim().min(1).max(60),
  categoryId: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  shortDescription: z.string().trim().min(1).max(500),
  activeIngredients: z.string().trim().max(2000).optional().or(z.literal("")),
  benefits: z.string().trim().max(2000).optional().or(z.literal("")),
  usageInstructions: z.string().trim().max(2000).optional().or(z.literal("")),
  dosage: z.string().trim().max(2000).optional().or(z.literal("")),
  heroImage: z.string().trim().max(500).optional().or(z.literal("")),
  gallery: z.array(z.string().max(500)).max(20).optional(),
  subBrandLogo: z.string().trim().max(500).optional().or(z.literal("")),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(300).optional().or(z.literal("")),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  faqs: z.array(faqSchema).max(20).optional(),
});

export const newsSchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(300)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1).max(50000),
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  tag: z.string().trim().max(80).optional().or(z.literal("")),
  author: z.string().trim().max(120).optional().or(z.literal("")),
  published: z.boolean().optional(),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export const partnerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  logo: z.string().trim().min(1, "Vui lòng tải logo").max(500),
  url: z.string().trim().max(500).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).optional(),
});

export const heroSlideSchema = z.object({
  image: z.string().trim().min(1, "Vui lòng tải ảnh").max(500),
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(400).optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  ctaHref: z.string().trim().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const jobSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  department: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(20000).optional().or(z.literal("")),
  published: z.boolean().optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export const activitySchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(300)
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  tag: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().min(1).max(5000),
  date: z.string().trim().min(1), // ISO date (yyyy-mm-dd)
  images: z.array(z.string().max(500)).max(12).optional(),
  published: z.boolean().optional(),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(30),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type NewsInput = z.infer<typeof newsSchema>;
