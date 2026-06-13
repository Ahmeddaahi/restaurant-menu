"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuItem } from "@/lib/menu";
import { getMenuItemName } from "@/lib/menu";
import MenuCard from "./MenuCard";

interface MenuGridProps {
  items: MenuItem[];
  activeCategory: string;
  searchQuery: string;
}

export default function MenuGrid({
  items,
  activeCategory,
  searchQuery,
}: MenuGridProps) {
  const locale = useLocale();
  const t = useTranslations("search");
  const tMenu = useTranslations("menu");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (!item.available) return false;
      if (activeCategory !== "All" && item.category !== activeCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = getMenuItemName(item, locale).toLowerCase();
        const desc = (
          locale === "so" ? item.descriptionSo : item.description
        ).toLowerCase();
        return name.includes(q) || desc.includes(q);
      }
      return true;
    });
  }, [items, activeCategory, searchQuery, locale]);

  return (
    <div>
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center text-sage"
          >
            {searchQuery.trim() ? t("noResults") : tMenu("noItems")}
          </motion.p>
        ) : (
          <motion.div
            key={`${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, index) => (
              <MenuCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
