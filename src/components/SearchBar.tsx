"use client";

import { useTranslations } from "next-intl";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations("search");

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sage"
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("placeholder")}
        className="focus-lime h-[52px] w-full rounded-xl border border-[rgba(184,240,74,0.2)] bg-surface pl-11 pr-4 text-sm text-cream placeholder:text-sage/70 transition-all duration-200"
      />
    </div>
  );
}
