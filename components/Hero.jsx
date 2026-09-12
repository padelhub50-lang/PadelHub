"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Truck } from "lucide-react";

export default function Hero({ site }) {
  return (
    <section className="relative px-5 md:px-7 pt-16 md:pt-24 pb-20 overflow-hidden bg-gradient-to-br from-[#181310] via-[#221208] to-[#3A1305]">
      <div className="pointer-events-none absolute -top-20 right-[-10%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,138,61,0.16),transparent_70%)] animate-floaty" />
      <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-gold/10 border border-gold/25 text-gold px-4 py-1.5 rounded-full mb-6"
        >
          <Sparkles size={14} /> Офіційний екіпірувальник падел-гравців
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl"
        >
          {site?.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-cream/70 text-base md:text-lg max-w-xl"
        >
          {site?.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#catalog" className="btn-primary px-7 py-3.5 inline-flex items-center gap-2">
            Обрати спорядження <ArrowRight size={17} />
          </a>
          <span className="inline-flex items-center gap-2 text-sm text-cream/60 px-4 py-3.5">
            <Truck size={16} /> Доставка по всій Україні
          </span>
        </motion.div>
      </div>
    </section>
  );
}
