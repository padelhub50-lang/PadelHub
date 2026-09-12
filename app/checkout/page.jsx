"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Truck, Wallet, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import Header from "../../components/Header.jsx";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "nova-poshta",
    city: "",
    cityRef: "",
    branch: "",
    address: "",
    notes: "",
    payment: "",
  });
  const [cityQuery, setCityQuery] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const debouncedCity = useDebounced(cityQuery, 300);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d.settings);
        const methods = [];
        if (d.settings?.payments?.stripeEnabled) methods.push("stripe");
        if (d.settings?.payments?.liqpayEnabled) methods.push("liqpay");
        if (d.settings?.payments?.codEnabled) methods.push("cod");
        setForm((f) => ({ ...f, payment: methods[0] || "cod" }));
      });
  }, []);

  useEffect(() => {
    if (!settings?.deliveryConfigured || debouncedCity.trim().length < 2) {
      setCityOptions([]);
      return;
    }
    fetch(`/api/delivery/cities?q=${encodeURIComponent(debouncedCity)}`)
      .then((r) => r.json())
      .then((d) => setCityOptions(d.results || []));
  }, [debouncedCity, settings]);

  const selectCity = async (c) => {
    setForm((f) => ({ ...f, city: c.name, cityRef: c.ref, branch: "" }));
    setCityOptions([]);
    setCityQuery(c.name);
    const res = await fetch(`/api/delivery/branches?cityRef=${encodeURIComponent(c.ref)}`);
    const d = await res.json();
    setBranchOptions(d.results || []);
  };

  const paymentOptions = useMemo(() => {
    if (!settings) return [];
    const list = [];
    if (settings.payments?.stripeEnabled)
      list.push({ id: "stripe", label: "Оплата карткою онлайн (Stripe)", icon: CreditCard });
    if (settings.payments?.liqpayEnabled)
      list.push({ id: "liqpay", label: "Оплата карткою онлайн (LiqPay)", icon: CreditCard });
    if (settings.payments?.codEnabled)
      list.push({ id: "cod", label: "Оплата при отриманні", icon: Wallet });
    return list;
  }, [settings]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Кошик порожній");
      return;
    }
    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          delivery: {
            method: form.deliveryMethod,
            city: form.city,
            branch: form.branch,
            address: form.address,
          },
          items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
          notes: form.notes,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Не вдалося створити замовлення");

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.order.id, provider: form.payment }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || "Не вдалося розпочати оплату");

      clear();

      if (checkoutData.redirectUrl) {
        router.push(checkoutData.redirectUrl);
        return;
      }
      if (checkoutData.formUrl) {
        const f = document.createElement("form");
        f.method = "POST";
        f.action = checkoutData.formUrl;
        for (const key of ["data", "signature"]) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = checkoutData[key];
          f.appendChild(input);
        }
        document.body.appendChild(f);
        f.submit();
        return;
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-5 md:px-7 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-cream/60 hover:text-white text-sm mb-6">
          <ChevronLeft size={16} /> Продовжити покупки
        </Link>
        <h1 className="text-3xl font-extrabold text-white mb-8">Оформлення замовлення</h1>

        {items.length === 0 ? (
          <p className="text-cream/60">Кошик порожній. <Link href="/" className="text-orange2">Перейти в каталог →</Link></p>
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="card p-6">
                <h2 className="font-bold text-white mb-4">Контактні дані</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Ім'я та прізвище *</label>
                    <input required className="input" value={form.name} onChange={update("name")} />
                  </div>
                  <div>
                    <label className="label">Телефон *</label>
                    <input required className="input" placeholder="+380..." value={form.phone} onChange={update("phone")} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Email</label>
                    <input type="email" className="input" value={form.email} onChange={update("email")} />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Truck size={18} /> Доставка
                </h2>
                {settings?.deliveryConfigured ? (
                  <div className="grid gap-4">
                    <div className="relative">
                      <label className="label">Місто</label>
                      <input
                        className="input"
                        value={cityQuery}
                        onChange={(e) => {
                          setCityQuery(e.target.value);
                          setForm((f) => ({ ...f, city: e.target.value, cityRef: "" }));
                        }}
                        placeholder="Почніть вводити назву міста"
                      />
                      {cityOptions.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full card max-h-56 overflow-y-auto">
                          {cityOptions.map((c) => (
                            <button
                              type="button"
                              key={c.ref}
                              onClick={() => selectCity(c)}
                              className="block w-full text-left px-4 py-2.5 text-sm text-cream hover:bg-white/5"
                            >
                              {c.full || c.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {form.cityRef && (
                      <div>
                        <label className="label">Відділення / поштомат</label>
                        <select className="input" value={form.branch} onChange={update("branch")}>
                          <option value="">Оберіть відділення</option>
                          {branchOptions.map((b) => (
                            <option key={b.ref} value={b.description}>
                              {b.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div>
                      <label className="label">Місто</label>
                      <input className="input" value={form.city} onChange={update("city")} />
                    </div>
                    <div>
                      <label className="label">Відділення Нової пошти / адреса</label>
                      <input className="input" value={form.branch} onChange={update("branch")} />
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="label">Коментар до замовлення</label>
                  <textarea className="input min-h-[80px]" value={form.notes} onChange={update("notes")} />
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-white mb-4">Спосіб оплати</h2>
                <div className="flex flex-col gap-2">
                  {paymentOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        form.payment === opt.id ? "border-orange bg-orange/10" : "border-line"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={form.payment === opt.id}
                        onChange={() => setForm((f) => ({ ...f, payment: opt.id }))}
                        className="accent-orange"
                      />
                      <opt.icon size={18} className="text-cream/70" />
                      <span className="text-sm text-white font-medium">{opt.label}</span>
                    </label>
                  ))}
                  {paymentOptions.length === 0 && (
                    <p className="text-sm text-bad">
                      Способи оплати ще не налаштовані. Зверніться до адміністратора магазину.
                    </p>
                  )}
                </div>
              </div>

              {error && <p className="text-bad text-sm">{error}</p>}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting || paymentOptions.length === 0}
                className="btn-primary py-4 flex items-center justify-center gap-2 text-base"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                Підтвердити замовлення на {money(totalPrice)}
              </motion.button>
            </form>

            <aside className="card p-6 h-fit sticky top-24">
              <h2 className="font-bold text-white mb-4">Ваше замовлення</h2>
              <div className="flex flex-col gap-3 mb-4">
                {items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-sm">
                    <span className="text-cream/70">
                      {it.name} × {it.qty}
                    </span>
                    <span className="text-white font-semibold">{money(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-4 border-t border-line">
                <span className="text-cream/70">Разом</span>
                <span className="text-xl font-extrabold text-white">{money(totalPrice)}</span>
              </div>
              <p className="text-xs text-cream/40 mt-3">
                Вартість доставки Новою поштою оплачується окремо, згідно тарифів перевізника.
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
