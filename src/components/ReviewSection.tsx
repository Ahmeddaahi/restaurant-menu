"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { reviews, getAverageRating, getInitials } from "@/lib/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "#E8C170" : "none"}
          stroke={i < rating ? "#E8C170" : "#7A8C7E"}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewSection() {
  const t = useTranslations("reviews");
  const avg = getAverageRating();

  return (
    <section className="bg-surface/30 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl text-cream sm:text-4xl">
            {t("title")}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={i < Math.round(avg) ? "#E8C170" : "none"}
                  stroke={i < Math.round(avg) ? "#E8C170" : "#7A8C7E"}
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="font-mono text-lg text-honey">{avg}</span>
            <span className="text-sm text-sage">
              {t("basedOn", { count: reviews.length })}
            </span>
          </div>
        </motion.div>

        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="w-72 shrink-0 rounded-xl border border-[rgba(184,240,74,0.12)] bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime/15 font-mono text-xs font-medium text-lime">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-cream">
                    {review.name}
                  </p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-sage">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-3 font-mono text-xs text-sage/60">
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
