"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

const STATUSES = ["pending", "confirmed", "paid", "shipped", "cancelled"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.order);
        setStatus(d.order?.status || "");
      });
  };

  useEffect(load, [params.id]);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    load();
  };

  if (!order) return <Loader2 className="animate-spin text-cream/40" />;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-cream/60 hover:text-white text-sm mb-6">
        <ChevronLeft size={16} /> До списку замовлень
      </Link>
      <h1 className="text-2xl font-extrabold text-white mb-6">Замовлення #{order.id}</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h2 className="font-bold text-white mb-3">Клієнт</h2>
          <p className="text-sm text-cream/70 leading-relaxed">
            Ім'я: {order.customer?.name}<br />
            Телефон: {order.customer?.phone}<br />
            Email: {order.customer?.email || "-"}
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-bold text-white mb-3">Доставка</h2>
          <p className="text-sm text-cream/70 leading-relaxed">
            Спосіб: {order.delivery?.method || "-"}<br />
            Місто: {order.delivery?.city || "-"}<br />
            Відділення/адреса: {order.delivery?.branch || order.delivery?.address || "-"}
          </p>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-bold text-white mb-3">Товари</h2>
        <div className="flex flex-col gap-2">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-cream/70">{it.name} × {it.qty}</span>
              <span className="text-white font-semibold">{money(it.price * it.qty)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 mt-3 border-t border-line">
          <span className="text-cream/70">Разом</span>
          <span className="text-xl font-extrabold text-white">{money(order.total)}</span>
        </div>
      </div>

      {order.notes && (
        <div className="card p-5 mb-6">
          <h2 className="font-bold text-white mb-2">Коментар клієнта</h2>
          <p className="text-sm text-cream/70">{order.notes}</p>
        </div>
      )}

      <div className="card p-5">
        <h2 className="font-bold text-white mb-3">Статус замовлення</h2>
        <p className="text-xs text-cream/50 mb-3">Спосіб оплати: {order.paymentProvider || "не обрано"}</p>
        <div className="flex gap-3">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={save} disabled={saving} className="btn-primary px-5 flex items-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
}
