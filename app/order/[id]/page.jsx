import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import { getOrder, getSettings } from "../../../lib/db.js";
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const STATUS_LABEL = {
  pending: { label: "Очікує оплати", icon: Clock, color: "text-gold" },
  confirmed: { label: "Підтверджено", icon: CheckCircle2, color: "text-good" },
  paid: { label: "Оплачено", icon: CheckCircle2, color: "text-good" },
  shipped: { label: "Відправлено", icon: Package, color: "text-orange2" },
  cancelled: { label: "Скасовано", icon: XCircle, color: "text-bad" },
};

export const dynamic = "force-dynamic";

export default function OrderStatusPage({ params, searchParams }) {
  const order = getOrder(params.id);
  if (!order) notFound();
  const settings = getSettings();
  const status = STATUS_LABEL[order.status] || STATUS_LABEL.pending;
  const StatusIcon = status.icon;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-5 md:px-7 py-16 text-center">
        <StatusIcon size={56} className={`mx-auto mb-4 ${status.color}`} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
          {searchParams?.cancelled ? "Оплату скасовано" : "Дякуємо за замовлення!"}
        </h1>
        <p className="text-cream/60 mb-8">
          Замовлення <b>#{order.id}</b> · статус: <span className={`font-bold ${status.color}`}>{status.label}</span>
        </p>

        <div className="card p-6 text-left">
          <h2 className="font-bold text-white mb-4">Товари</h2>
          <div className="flex flex-col gap-2 mb-4">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-cream/70">{it.name} × {it.qty}</span>
                <span className="text-white font-semibold">{money(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t border-line">
            <span className="text-cream/70">Разом</span>
            <span className="text-xl font-extrabold text-white">{money(order.total)}</span>
          </div>
        </div>

        <p className="text-sm text-cream/50 mt-6">
          Ми надіслали деталі замовлення на нашу пошту та зв'яжемося з вами за телефоном{" "}
          <b>{order.customer?.phone}</b> для підтвердження.
        </p>

        <Link href="/" className="btn-primary inline-flex items-center justify-center px-6 py-3 mt-8">
          На головну
        </Link>
      </main>
      <Footer site={settings.site} />
    </>
  );
}
