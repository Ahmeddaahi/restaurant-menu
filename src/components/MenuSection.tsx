"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/menu";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";
import MenuGrid from "./MenuGrid";

interface MenuSectionProps {
  items: MenuItem[];
}

export default function MenuSection({ items }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <CategoryNav active={activeCategory} onChange={setActiveCategory} />
      <section id="menu" className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <MenuGrid
            items={items}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </div>
      </section>
    </>
  );
}
