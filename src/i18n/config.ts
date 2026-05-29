// Cấu hình đa ngôn ngữ (i18n-ready).
// Vòng này chỉ phát hành nội dung tiếng Việt; cấu trúc sẵn sàng thêm 'en' sau.
export const locales = ["vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";
