"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const t = useTranslations("hero");

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src="/images/de44e0ea-d57c-44d7-8f91-24b0f07a46a0.webp"
        alt="Nadi Cafe interior"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,15,13,0.3)] to-[rgba(10,15,13,0.85)]" />

      <div className="liquid-wave absolute inset-0" />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-lime sm:text-sm"
        >
          {t("eyebrow")}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-medium leading-tight text-cream sm:text-6xl lg:text-[72px]"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-md text-base text-sage sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <button
            onClick={scrollToMenu}
            className="w-full rounded-full bg-lime px-8 py-3.5 text-sm font-semibold text-forest transition-all duration-200 hover:bg-lime/90 hover:shadow-[0_0_24px_rgba(184,240,74,0.3)] sm:w-auto"
          >
            {t("exploreMenu")}
          </button>
          <button
            onClick={scrollToAbout}
            className="w-full rounded-full border border-[rgba(184,240,74,0.3)] bg-transparent px-8 py-3.5 text-sm font-medium text-cream transition-all duration-200 hover:border-lime/50 hover:bg-lime/5 sm:w-auto"
          >
            {t("ourStory")}
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToMenu}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sage transition-colors hover:text-lime"
        aria-label={t("scrollDown")}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </motion.button>
    </section>
  );
}
