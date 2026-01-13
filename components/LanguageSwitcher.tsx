"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale as Locale });
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg px-2 py-1.5 text-sm text-[color:var(--sf-text)] hover:border-[color:var(--sf-primary)] transition-colors cursor-pointer focus:outline-none focus:border-[color:var(--sf-primary)]"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
