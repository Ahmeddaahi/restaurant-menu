"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { getMenuItemName } from "@/lib/menu";

const WHATSAPP_NUMBER = "251915745157";

export default function CartDrawer() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const tMenu = useTranslations("menu");
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCartStore();

  const total = subtotal();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    const lines = items.map(({ item, quantity }) => {
      const name = getMenuItemName(item, locale);
      return `• ${quantity}x ${name} — ${item.price * quantity} ${tMenu("currency")}`;
    });

    const message = encodeURIComponent(
      `🛒 *Nadi Cafe Order*\n\n${lines.join("\n")}\n\n*${t("subtotal")}: ${total} ${tMenu("currency")}*`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-forest/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[rgba(184,240,74,0.1)] px-5 py-4">
              <h2 className="font-display text-xl text-cream">{t("title")}</h2>
              <button
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-full text-sage transition-colors hover:bg-forest hover:text-cream"
                aria-label="Close cart"
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
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sage">{t("empty")}</p>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ item, quantity }) => {
                    const name = getMenuItemName(item, locale);
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-xl border border-[rgba(184,240,74,0.1)] bg-forest/50 p-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={item.image}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-cream">
                            {name}
                          </p>
                          <p className="font-mono text-sm text-lime">
                            {item.price} {tMenu("currency")}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, quantity - 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(184,240,74,0.2)] text-sage transition-colors hover:border-lime/40 hover:text-cream"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-mono text-sm text-cream">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, quantity + 1)
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(184,240,74,0.2)] text-sage transition-colors hover:border-lime/40 hover:text-cream"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-xs text-sage transition-colors hover:text-red-400"
                            >
                              {t("remove")}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[rgba(184,240,74,0.1)] px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sage">{t("subtotal")}</span>
                  <span className="font-mono text-lg text-lime">
                    {total} {tMenu("currency")}
                  </span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full rounded-full bg-lime py-3.5 text-sm font-semibold text-forest transition-all duration-200 hover:bg-lime/90 hover:shadow-[0_0_24px_rgba(184,240,74,0.3)]"
                >
                  {t("placeOrder")}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
