export const locales = ['en', 'zh', 'ms', 'vi', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ms: 'Bahasa Melayu',
  vi: 'Tiếng Việt',
  ko: '한국어',
};

// Locale detection settings
export const localeDetection = {
  lookupFromPathIndex: 0,
  lookupFromCookie: 'NEXT_LOCALE',
  lookupFromHeader: true,
};
