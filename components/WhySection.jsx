"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Star, Wallet } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Швидка доставка", text: "Відправляємо замовлення протягом 1 дня Новою поштою по всій Україні." },
  { icon: ShieldCheck, title: "Тільки оригінал", text: "Працюємо напряму з брендами — жодних підробок чи сірого імпорту." },
  { icon: Star, title: "Перевірений вибір", text: "У каталозі — тільки спорядження, перевірене нашими інструкторами та гравцями." },
  { icon: Wallet, title: "Зручна оплата", text: "Оплата карткою онлайн або при отриманні — обирайте, як зручно." },
];

export default function WhySection() {
  return (
    <section id="why" className="max-w-7xl mx-auto px-5 md:px-7 py-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-8">Чому обирають Padel Hub</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-bg3 hover:bg-orange/10 transition-colors flex flex-col gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center text-white">
              <it.icon size={20} />
            </div>
            <h3 className="font-bold text-white">{it.title}</h3>
            <p className="text-sm text-cream/60 leading-relaxed">{it.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
