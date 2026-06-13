"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/menu";
import {
  getMenuItemName,
  getMenuItemDescription,
} from "@/lib/menu";
import { useCartStore } from "@/store/cart";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const addItem = useCartStore((s) => s.addItem);

  const name = getMenuItemName(item, locale);
  const description = getMenuItemDescription(item, locale);
  const isPopular = item.tags.includes("Popular");
  const isNew = item.tags.includes("New");

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: (index % 3) * 0.08,
        ease: "easeOut",
      }}
      className="group overflow-hidden rounded-xl border border-[rgba(184,240,74,0.15)] bg-surface transition-all duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {(isPopular || isNew) && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {isPopular && (
              <span className="rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
                {t("popular")}
              </span>
            )}
            {isNew && (
              <span className="rounded-full bg-honey px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest">
                {t("new")}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-medium text-cream">{name}</h3>
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-sage">
              {description}
            </p>
          </div>
          <button
            onClick={() => addItem(item)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-forest transition-all duration-200 hover:scale-110 hover:shadow-[0_0_16px_rgba(184,240,74,0.4)] active:scale-95"
            aria-label={`${t("add")} ${name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <p className="mt-3 font-mono text-lg text-lime">
          {item.price} {t("currency")}
        </p>
      </div>
    </motion.article>
  );
}
