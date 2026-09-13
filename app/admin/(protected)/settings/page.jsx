"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Send, Check } from "lucide-react";

const TABS = [
  { id: "site", label: "Контент сайту" },
  { id: "email", label: "Пошта" },
  { id: "payments", label: "Оплата" },
  { id: "delivery", label: "Доставка" },
  { id: "security", label: "Безпека" },
];

function Field({ label, hint, children }) {
  return (
    <div className="mb-4">
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-cream/40 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("site");
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings));
  }, []);

  const set = (section, key) => (e) => {
    const value = e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setSettings((s) => ({ ...s, [section]: { ...s[section], [key]: value } }));
  };

  const setNested = (section, sub, key) => (e) => {
    const value = e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setSettings((s) => ({
      ...s,
      [section]: { ...s[section], [sub]: { ...s[section][sub], [key]: value } },
    }));
  };

  const save = async (patch) => {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setSettings(data.settings);
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1600);
    }
  };

  if (!settings) return <Loader2 className="animate-spin text-cream/40" />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-white mb-6">Налаштування</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`chip ${tab === t.id ? "chip-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "site" && (
        <div className="card p-6">
          <Field label="Заголовок на головній (UA)">
            <input className="input" value={settings.site.heroTitle} onChange={set("site", "heroTitle")} />
          </Field>
          <Field label="Заголовок на головній (EN)" hint="Якщо залишити порожнім — англійською покаже український текст">
            <input className="input" value={settings.site.heroTitleEn} onChange={set("site", "heroTitleEn")} />
          </Field>
          <Field label="Підзаголовок на головній (UA)">
            <textarea className="input" value={settings.site.heroSubtitle} onChange={set("site", "heroSubtitle")} />
          </Field>
          <Field label="Підзаголовок на головній (EN)">
            <textarea className="input" value={settings.site.heroSubtitleEn} onChange={set("site", "heroSubtitleEn")} />
          </Field>
          <Field label="Текст «Про нас» (у підвалі сайту, UA)">
            <textarea className="input min-h-[90px]" value={settings.site.aboutText} onChange={set("site", "aboutText")} />
          </Field>
          <Field label="Текст «Про нас» (у підвалі сайту, EN)">
            <textarea className="input min-h-[90px]" value={settings.site.aboutTextEn} onChange={set("site", "aboutTextEn")} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Телефон">
              <input className="input" value={settings.site.contactPhone} onChange={set("site", "contactPhone")} />
            </Field>
            <Field label="Email для показу на сайті">
              <input className="input" value={settings.site.contactEmail} onChange={set("site", "contactEmail")} />
            </Field>
            <Field label="Instagram (посилання)">
              <input className="input" value={settings.site.instagram} onChange={set("site", "instagram")} />
            </Field>
            <Field label="Telegram (посилання)">
              <input className="input" value={settings.site.telegram} onChange={set("site", "telegram")} />
            </Field>
          </div>
          <SaveButton onClick={() => save({ site: settings.site })} saving={saving} saved={savedTick} />
        </div>
      )}

      {tab === "email" && (
        <div className="card p-6">
          <p className="text-sm text-cream/60 mb-4">
            Сюди вставте дані поштової скриньки, з якої надсилатимуться сповіщення про замовлення.
            Для Gmail: увімкніть двофакторну автентифікацію та створіть «пароль додатку» — https://myaccount.google.com/apppasswords
          </p>
          <label className="flex items-center gap-2 text-sm text-cream/80 mb-4">
            <input type="checkbox" checked={settings.email.enabled} onChange={set("email", "enabled")} className="accent-orange" />
            Увімкнути надсилання листів
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="SMTP хост" hint="напр. smtp.gmail.com">
              <input className="input" value={settings.email.host} onChange={set("email", "host")} />
            </Field>
            <Field label="SMTP порт" hint="465 (SSL) або 587 (TLS)">
              <input className="input" value={settings.email.port} onChange={set("email", "port")} />
            </Field>
            <Field label="Логін (email)">
              <input className="input" value={settings.email.user} onChange={set("email", "user")} />
            </Field>
            <Field label="Пароль / API-ключ додатку">
              <input type="password" className="input" value={settings.email.pass} onChange={set("email", "pass")} />
            </Field>
            <Field label="Ім'я відправника">
              <input className="input" value={settings.email.fromName} onChange={set("email", "fromName")} />
            </Field>
            <Field label="Кому надсилати замовлення">
              <input className="input" value={settings.email.toEmail} onChange={set("email", "toEmail")} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-cream/80 mb-4">
            <input type="checkbox" checked={settings.email.secure} onChange={set("email", "secure")} className="accent-orange" />
            Використовувати SSL (для порту 465)
          </label>
          <div className="flex gap-3">
            <SaveButton onClick={() => save({ email: settings.email })} saving={saving} saved={savedTick} />
            <TestEmailButton />
          </div>
        </div>
      )}

      {tab === "payments" && (
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <label className="flex items-center gap-2 text-sm text-cream/80 mb-4">
              <input
                type="checkbox"
                checked={settings.payments.codEnabled}
                onChange={set("payments", "codEnabled")}
                className="accent-orange"
              />
              Дозволити оплату при отриманні (готівкою / переказом)
            </label>
            <SaveButton onClick={() => save({ payments: { codEnabled: settings.payments.codEnabled } })} saving={saving} saved={savedTick} />
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-white mb-1">Stripe</h2>
            <p className="text-sm text-cream/50 mb-4">Ключі беруться в кабінеті Stripe → Developers → API keys.</p>
            <label className="flex items-center gap-2 text-sm text-cream/80 mb-4">
              <input
                type="checkbox"
                checked={settings.payments.stripe.enabled}
                onChange={setNested("payments", "stripe", "enabled")}
                className="accent-orange"
              />
              Увімкнути оплату Stripe
            </label>
            <Field label="Publishable key">
              <input className="input" value={settings.payments.stripe.publishableKey} onChange={setNested("payments", "stripe", "publishableKey")} />
            </Field>
            <Field label="Secret key">
              <input type="password" className="input" value={settings.payments.stripe.secretKey} onChange={setNested("payments", "stripe", "secretKey")} />
            </Field>
            <Field label="Webhook signing secret" hint="Stripe Dashboard → Webhooks → додайте endpoint /api/webhooks/stripe">
              <input type="password" className="input" value={settings.payments.stripe.webhookSecret} onChange={setNested("payments", "stripe", "webhookSecret")} />
            </Field>
            <SaveButton onClick={() => save({ payments: { stripe: settings.payments.stripe } })} saving={saving} saved={savedTick} />
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-white mb-1">LiqPay</h2>
            <p className="text-sm text-cream/50 mb-4">Ключі беруться в кабінеті LiqPay → Магазин → Налаштування API.</p>
            <label className="flex items-center gap-2 text-sm text-cream/80 mb-4">
              <input
                type="checkbox"
                checked={settings.payments.liqpay.enabled}
                onChange={setNested("payments", "liqpay", "enabled")}
                className="accent-orange"
              />
              Увімкнути оплату LiqPay
            </label>
            <Field label="Public key">
              <input className="input" value={settings.payments.liqpay.publicKey} onChange={setNested("payments", "liqpay", "publicKey")} />
            </Field>
            <Field label="Private key">
              <input type="password" className="input" value={settings.payments.liqpay.privateKey} onChange={setNested("payments", "liqpay", "privateKey")} />
            </Field>
            <p className="text-xs text-cream/40 mb-4">
              Server URL для сповіщень: <code>{typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/liqpay</code>
            </p>
            <SaveButton onClick={() => save({ payments: { liqpay: settings.payments.liqpay } })} saving={saving} saved={savedTick} />
          </div>
        </div>
      )}

      {tab === "delivery" && (
        <div className="card p-6">
          <p className="text-sm text-cream/60 mb-4">
            Ключ API Нової пошти вмикає живий пошук міст і відділень на сторінці оформлення замовлення.
            Отримати ключ: особистий кабінет Нової пошти → Налаштування → API.
          </p>
          <Field label="API-ключ Нової пошти">
            <input className="input" value={settings.delivery.novaPoshtaApiKey} onChange={set("delivery", "novaPoshtaApiKey")} />
          </Field>
          <SaveButton onClick={() => save({ delivery: settings.delivery })} saving={saving} saved={savedTick} />
        </div>
      )}

      {tab === "security" && <SecurityTab />}
    </div>
  );
}

function SaveButton({ onClick, saving, saved }) {
  return (
    <button onClick={onClick} disabled={saving} className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm">
      {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
      {saved ? "Збережено" : "Зберегти"}
    </button>
  );
}

const MAIL_REASONS = {
  smtp_not_configured: "Заповніть хост, логін і пароль перед тестом.",
  email_disabled: "Спочатку увімкніть та збережіть надсилання листів.",
};

function TestEmailButton() {
  const [state, setState] = useState("idle");
  const [detail, setDetail] = useState("");

  const test = async () => {
    setState("loading");
    setDetail("");
    const res = await fetch("/api/mailer/test", { method: "POST" });
    const data = await res.json();
    setState(data.sent ? "sent" : "error");
    if (data.sent) {
      setTimeout(() => setState("idle"), 2500);
    } else {
      setDetail(MAIL_REASONS[data.reason] || data.error || "Невідома помилка");
    }
  };

  return (
    <div>
      <button onClick={test} disabled={state === "loading"} className="btn-ghost px-5 py-2.5 flex items-center gap-2 text-sm">
        {state === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {state === "sent" ? "Лист надіслано!" : state === "error" ? "Помилка надсилання" : "Надіслати тест"}
      </button>
      {state === "error" && detail && <p className="text-xs text-bad mt-2 max-w-md break-words">{detail}</p>}
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    setLoading(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Помилка");
      return;
    }
    setOk(true);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <form onSubmit={submit} className="card p-6 max-w-md">
      <h2 className="font-bold text-white mb-4">Змінити пароль адміністратора</h2>
      <Field label="Поточний пароль">
        <input type="password" required className="input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </Field>
      <Field label="Новий пароль" hint="Мінімум 6 символів">
        <input type="password" required className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </Field>
      {error && <p className="text-bad text-sm mb-3">{error}</p>}
      {ok && <p className="text-good text-sm mb-3">Пароль оновлено</p>}
      <button type="submit" disabled={loading} className="btn-primary px-5 py-2.5 text-sm">
        {loading ? "Збереження..." : "Змінити пароль"}
      </button>
    </form>
  );
}
