"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import ImageUploader from "../../../../../components/ImageUploader.jsx";

const DEFAULT_CATEGORIES = ["Ракетки", "М'ячі", "Сумки", "Взуття", "Одяг", "Аксесуари"];
const TAGS = ["", "Хіт", "Новинка", "Знижка"];

const EMPTY = {
  name: "",
  category: DEFAULT_CATEGORIES[0],
  price: "",
  oldPrice: "",
  stock: 0,
  tag: "",
  description: "",
  images: [],
  active: true,
};

export default function ProductEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const cats = new Set(DEFAULT_CATEGORIES);
        (d.products || []).forEach((p) => cats.add(p.category));
        setCategories(Array.from(cats));
      });
  }, []);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) setForm({ ...d.product, price: String(d.product.price), oldPrice: d.product.oldPrice ? String(d.product.oldPrice) : "" });
      })
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  const update = (key) => (e) => {
    const value = e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock) || 0,
      tag: form.tag || null,
    };
    const url = isNew ? "/api/products" : `/api/products/${params.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Помилка збереження");
      return;
    }
    router.push("/admin/products");
  };

  if (loading) {
    return <Loader2 className="animate-spin text-cream/40" />;
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-cream/60 hover:text-white text-sm mb-6">
        <ChevronLeft size={16} /> До списку товарів
      </Link>
      <h1 className="text-2xl font-extrabold text-white mb-6">{isNew ? "Новий товар" : "Редагувати товар"}</h1>

      <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
        <div>
          <label className="label">Фотографії товару</label>
          <ImageUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
        </div>

        <div>
          <label className="label">Назва товару</label>
          <input required className="input" value={form.name} onChange={update("name")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Категорія</label>
            <input list="categories" className="input" value={form.category} onChange={update("category")} />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label">Позначка</label>
            <select className="input" value={form.tag || ""} onChange={update("tag")}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t || "Без позначки"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Ціна, грн</label>
            <input required type="number" min="0" className="input" value={form.price} onChange={update("price")} />
          </div>
          <div>
            <label className="label">Стара ціна, грн</label>
            <input type="number" min="0" className="input" value={form.oldPrice} onChange={update("oldPrice")} />
          </div>
          <div>
            <label className="label">Залишок, шт.</label>
            <input type="number" min="0" className="input" value={form.stock} onChange={update("stock")} />
          </div>
        </div>

        <div>
          <label className="label">Опис</label>
          <textarea className="input min-h-[110px]" value={form.description} onChange={update("description")} />
        </div>

        <label className="flex items-center gap-2 text-sm text-cream/80">
          <input type="checkbox" checked={form.active} onChange={update("active")} className="accent-orange" />
          Показувати на сайті
        </label>

        {error && <p className="text-bad text-sm">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary py-3 flex items-center justify-center gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Зберегти товар
        </button>
      </form>
    </div>
  );
}
