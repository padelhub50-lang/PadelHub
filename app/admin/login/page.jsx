"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Помилка входу");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5">
      <form onSubmit={handleSubmit} className="card p-8 w-full max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-rust flex items-center justify-center text-white mb-5">
          <Lock size={20} />
        </div>
        <h1 className="text-xl font-extrabold text-white mb-1">Padel Hub — Керування</h1>
        <p className="text-sm text-cream/50 mb-6">Введіть пароль адміністратора</p>
        <label className="label">Пароль</label>
        <input
          type="password"
          autoFocus
          className="input mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-bad text-sm mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}
