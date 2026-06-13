export interface MenuItem {
  id: string;
  name: string;
  nameSo: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  descriptionSo: string;
  image: string;
  tags: string[];
  available: boolean;
}

export interface MenuData {
  categories: string[];
  items: MenuItem[];
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  All: "✨",
  Juices: "🥤",
  Smoothies: "🥭",
  Snacks: "🥗",
  "Hot Drinks": "☕",
  Specials: "⭐",
};

export const CATEGORY_KEYS: Record<string, string> = {
  All: "all",
  Juices: "juices",
  Smoothies: "smoothies",
  Snacks: "snacks",
  "Hot Drinks": "hotDrinks",
  Specials: "specials",
};

import menuData from "@/data/menu.json";

export function getMenuData(): MenuData {
  return menuData as MenuData;
}

export function getMenuItemName(item: MenuItem, locale: string): string {
  return locale === "so" ? item.nameSo : item.name;
}

export function getMenuItemDescription(item: MenuItem, locale: string): string {
  return locale === "so" ? item.descriptionSo : item.description;
}
