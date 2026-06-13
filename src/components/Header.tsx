"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCartStore();
  const count = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = (newLocale: "en" | "so") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-forest/80 backdrop-blur-[12px] shadow-[var(--shadow-header)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/logo.webp"
          alt="Nadi Cafe"
          width={120}
          height={36}
          className="h-9 w-auto object-contain"
          priority
        />

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[rgba(184,240,74,0.15)] bg-surface/60 p-0.5">
            {(["so", "en"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => switchLocale(lang)}
                className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  locale === lang
                    ? "bg-lime text-forest"
                    : "text-sage hover:text-cream"
                }`}
                aria-label={`Switch to ${lang === "so" ? "Somali" : "English"}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(184,240,74,0.15)] bg-surface/60 text-cream transition-colors duration-200 hover:border-lime/30 hover:bg-surface"
            aria-label={t("cart")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-forest"
                >
                  {count > 9 ? "9+" : count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}
