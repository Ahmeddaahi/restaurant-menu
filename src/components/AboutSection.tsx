"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AboutSection() {
  const t = useTranslations("about");

  const highlights = [
    { icon: "🌿", label: t("fresh") },
    { icon: "🇪🇹", label: t("local") },
    { icon: "💚", label: t("love") },
  ];

  return (
    <section
      id="about"
      className="grain-overlay bg-forest py-12 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/de44e0ea-d57c-44d7-8f91-24b0f07a46a0.webp"
              alt="Nadi Cafe"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="font-display text-3xl italic text-cream sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <div className="mt-6 space-y-4 text-sage leading-relaxed">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {highlights.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-[rgba(184,240,74,0.15)] bg-surface/50 px-4 py-2 text-sm text-cream"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
