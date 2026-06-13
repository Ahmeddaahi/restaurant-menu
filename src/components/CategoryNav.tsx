"use client";

import { useTranslations } from "next-intl";
import { CATEGORY_EMOJIS, CATEGORY_KEYS } from "@/lib/menu";

const ALL_CATEGORIES = [
  "All",
  "Juices",
  "Smoothies",
  "Snacks",
  "Hot Drinks",
  "Specials",
];

interface CategoryNavProps {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryNav({ active, onChange }: CategoryNavProps) {
  const t = useTranslations("categories");

  return (
    <nav
      id="category-nav"
      className="sticky top-16 z-40 border-b border-[rgba(184,240,74,0.08)] bg-forest/90 backdrop-blur-[12px]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = active === cat;
            const key = CATEGORY_KEYS[cat];
            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-lime text-forest shadow-[0_0_16px_rgba(184,240,74,0.2)]"
                    : "border border-[rgba(184,240,74,0.15)] text-sage hover:border-lime/25 hover:text-cream"
                }`}
              >
                <span className="text-base leading-none">
                  {CATEGORY_EMOJIS[cat]}
                </span>
                {t(key)}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
