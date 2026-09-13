"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Header() {
  const { totalCount, setDrawerOpen } = useCart();
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/#catalog", label: t("nav.catalog") },
    { href: "/#why", label: t("nav.why") },
    { href: "/#contacts", label: t("nav.contacts") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#14110e]/92 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-5 md:px-7 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center font-extrabold text-white">
            P
          </span>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Padel<span className="text-orange2">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 text-sm font-semibold text-cream hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label={t("nav.lang")}
            className="hidden sm:flex items-center bg-white/5 border border-line rounded-xl p-0.5 text-xs font-bold"
          >
            <button
              onClick={() => setLang("uk")}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                lang === "uk" ? "bg-gradient-to-br from-orange to-rust text-white" : "text-cream/60 hover:text-white"
              }`}
            >
              UA
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                lang === "en" ? "bg-gradient-to-br from-orange to-rust text-white" : "text-cream/60 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-white/5 border border-line flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-orange hover:to-rust transition-all"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag size={18} />
            {totalCount > 0 && (
              <motion.span
                key={totalCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-gold text-[#221B15] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {totalCount}
              </motion.span>
            )}
          </button>
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-line flex items-center justify-center text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("nav.menu")}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-[#14110e] px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-2 py-2.5 text-sm font-semibold text-cream hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-2 px-2 pt-2 mt-1 border-t border-line">
            <button
              onClick={() => setLang("uk")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                lang === "uk" ? "bg-gradient-to-br from-orange to-rust text-white" : "bg-white/5 text-cream/60"
              }`}
            >
              UA
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                lang === "en" ? "bg-gradient-to-br from-orange to-rust text-white" : "bg-white/5 text-cream/60"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
