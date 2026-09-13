"use client";

import Link from "next/link";
import { CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import { useLang } from "../context/LanguageContext.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const STATUS_META = {
  pending: { key: "order.status.pending", icon: Clock, color: "text-gold" },
  confirmed: { key: "order.status.confirmed", icon: CheckCircle2, color: "text-good" },
  paid: { key: "order.status.paid", icon: CheckCircle2, color: "text-good" },
  shipped: { key: "order.status.shipped", icon: Package, color: "text-orange2" },
  cancelled: { key: "order.status.cancelled", icon: XCircle, color: "text-bad" },
};

export default function OrderStatus({ order, cancelled }) {
  const { t } = useLang();
  const status = STATUS_META[order.status] || STATUS_META.pending;
  const StatusIcon = status.icon;

  return (
    <main className="max-w-2xl mx-auto px-5 md:px-7 py-16 text-center">
      <StatusIcon size={56} className={`mx-auto mb-4 ${status.color}`} />
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
        {cancelled ? t("order.paymentCancelled") : t("order.thankYou")}
      </h1>
      <p className="text-cream/60 mb-8">
        {t("order.number")} <b>#{order.id}</b> · {t("order.status")}:{" "}
        <span className={`font-bold ${status.color}`}>{t(status.key)}</span>
      </p>

      <div className="card p-6 text-left">
        <h2 className="font-bold text-white mb-4">{t("order.items")}</h2>
        <div className="flex flex-col gap-2 mb-4">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-cream/70">
                {it.name} × {it.qty}
              </span>
              <span className="text-white font-semibold">{money(it.price * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4 border-t border-line">
          <span className="text-cream/70">{t("order.total")}</span>
          <span className="text-xl font-extrabold text-white">{money(order.total)}</span>
        </div>
      </div>

      <p className="text-sm text-cream/50 mt-6">
        {t("order.followUp")} <b>{order.customer?.phone}</b> {t("order.forConfirmation")}
      </p>

      <Link href="/" className="btn-primary inline-flex items-center justify-center px-6 py-3 mt-8">
        {t("order.home")}
      </Link>
    </main>
  );
}
