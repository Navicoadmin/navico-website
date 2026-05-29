import type { Locale } from "./config";
import vi, { type Dictionary } from "./dictionaries/vi";

// Lấy từ điển theo locale. Hiện chỉ có 'vi'; thêm 'en' chỉ cần map thêm key.
const dictionaries: Record<Locale, Dictionary> = {
  vi,
};

export function getDictionary(locale: Locale = "vi"): Dictionary {
  return dictionaries[locale] ?? vi;
}

export type { Dictionary };
