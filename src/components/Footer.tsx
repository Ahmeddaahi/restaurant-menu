"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "en" | "so") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <footer className="border-t border-[rgba(184,240,74,0.08)] bg-forest py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Image
              src="/images/logo.webp"
              alt="Nadi Cafe"
              width={100}
              height={30}
              className="h-8 w-auto object-contain opacity-90"
            />
            <p className="text-sm text-sage">{t("tagline")}</p>
          </div>

          <div className="flex items-center rounded-full border border-[rgba(184,240,74,0.15)] bg-surface/40 p-0.5">
            {(["so", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => switchLocale(lang)}
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  locale === lang
                    ? "bg-lime text-forest"
                    : "text-sage hover:text-cream"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/nadicafe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(184,240,74,0.15)] text-sage transition-all duration-200 hover:border-lime/30 hover:text-lime"
              aria-label={t("instagram")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://wa.me/251915745157"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(184,240,74,0.15)] text-sage transition-all duration-200 hover:border-lime/30 hover:text-lime"
              aria-label={t("whatsapp")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-sage/60">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
