"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Wand2, RotateCcw, ShoppingBag, ImageOff, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import RacketStatBars from "./RacketStatBars.jsx";

const QUESTIONS = [
  {
    question: "Як ти найчастіше граєш на корті?",
    options: [
      { label: "Атакую та йду до сітки", weights: { attack: 3, control: 1 } },
      { label: "Тримаюсь задньої лінії, вичікую", weights: { defense: 3, control: 1 } },
      { label: "Граю збалансовано, підлаштовуюсь під суперника", weights: { versatility: 3 } },
    ],
  },
  {
    question: "Що для тебе важливіше в грі?",
    options: [
      { label: "Потужність та сила ударів", weights: { attack: 3 } },
      { label: "Точність і контроль м'яча", weights: { control: 3 } },
      { label: "Стабільність в оборонних розіграшах", weights: { defense: 3 } },
    ],
  },
  {
    question: "Який у тебе рівень гри?",
    options: [
      { label: "Новачок, тільки починаю", weights: { control: 2, versatility: 2 } },
      { label: "Середній рівень", weights: { versatility: 2, control: 1, attack: 1 } },
      { label: "Просунутий або турнірний", weights: { attack: 2, control: 2 } },
    ],
  },
  {
    question: "Що найчастіше підводить у твоїй грі?",
    options: [
      { label: "Не вистачає сили в завершальних ударах", weights: { attack: 2 } },
      { label: "Важко стабільно захищатись від смешів", weights: { defense: 2 } },
      { label: "Помиляюсь з контролем траєкторії", weights: { control: 2 } },
    ],
  },
  {
    question: "Яку ракетку ти шукаєш за вагою та маневреністю?",
    options: [
      { label: "Легку і маневрену для швидкої гри", weights: { versatility: 2, control: 1 } },
      { label: "Важчу й потужнішу для сильних ударів", weights: { attack: 2 } },
      { label: "Збалансовану під будь-яку ситуацію", weights: { versatility: 2, defense: 1 } },
    ],
  },
];

const RESULT_COUNT = 3;

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

function pickTopRackets(rackets, totals, count) {
  return rackets
    .map((p) => {
      let score = 0;
      for (const key of Object.keys(totals)) score += totals[key] * (p.stats?.[key] || 5);
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((r) => r.product);
}

export default function RacketQuiz({ products }) {
  const rackets = useMemo(
    () => products.filter((p) => p.category === "Ракетки" && p.stats && Object.keys(p.stats).length > 0),
    [products]
  );

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const panelRef = useRef(null);
  const { addItem } = useCart();

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;
      gsap.from(panelRef.current, { opacity: 0, y: 16, scale: 0.96, duration: 0.3, ease: "power2.out" });
    },
    { dependencies: [open] }
  );

  useGSAP(
    () => {
      if (!open) return;
      const inner = panelRef.current?.querySelector("[data-quiz-step]");
      if (!inner) return;
      gsap.from(inner, { opacity: 0, y: 8, duration: 0.25, ease: "power2.out" });
    },
    { dependencies: [step, answers.length] }
  );

  if (rackets.length === 0) return null;

  const done = answers.length === QUESTIONS.length;
  const results = done
    ? pickTopRackets(
        rackets,
        answers.reduce((acc, a) => {
          for (const [k, v] of Object.entries(a)) acc[k] = (acc[k] || 0) + v;
          return acc;
        }, {}),
        Math.min(RESULT_COUNT, rackets.length)
      )
    : [];

  const choose = (weights) => {
    const next = [...answers, weights];
    setAnswers(next);
    if (next.length <= QUESTIONS.length) setStep((s) => Math.min(s + 1, QUESTIONS.length - 1));
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 bottom-20 sm:bottom-24 right-4 left-4 sm:left-auto sm:w-[380px] max-h-[76vh] overflow-y-auto card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-gold/10 border border-gold/25 text-gold px-3 py-1 rounded-full">
              <Wand2 size={13} /> Підбір ракетки
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-cream/60 hover:text-white"
              aria-label="Закрити"
            >
              <X size={14} />
            </button>
          </div>

          <div data-quiz-step>
            {!done ? (
              <>
                <div className="flex items-center gap-1.5 mb-5">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-gradient-to-r from-orange to-gold" : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <h3 className="text-base font-bold text-white mb-4">{QUESTIONS[step].question}</h3>
                <div className="flex flex-col gap-2.5">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => choose(opt.weights)}
                      className="text-left px-4 py-3 rounded-xl bg-white/5 border border-line hover:border-orange/50 hover:bg-orange/10 transition-colors text-cream/90 font-semibold text-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-3">
                  Тобі підійдуть ці ракетки
                </div>
                <div className="flex flex-col gap-3">
                  {results.map((product, i) => (
                    <div key={product.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-line">
                      <Link
                        href={`/product/${product.id}`}
                        className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-bg3 to-bg2 flex items-center justify-center"
                      >
                        {product.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageOff size={18} className="text-cream/30" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {i === 0 && (
                            <span className="text-[9px] font-bold uppercase text-good bg-good/15 px-1.5 py-0.5 rounded-full shrink-0">
                              Найкращий збіг
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/product/${product.id}`}
                          className="block text-sm font-bold text-white hover:text-orange2 transition-colors truncate"
                        >
                          {product.name}
                        </Link>
                        <RacketStatBars stats={product.stats} compact />
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-sm font-extrabold text-white">{money(product.price)}</span>
                          <button
                            onClick={() => addItem(product, 1)}
                            className="btn-primary w-8 h-8 flex items-center justify-center shrink-0"
                            aria-label="Додати в кошик"
                          >
                            <ShoppingBag size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="btn-ghost w-full mt-4 px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <RotateCcw size={14} /> Пройти ще раз
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 bottom-5 right-4 sm:right-5 btn-primary px-4 py-3.5 inline-flex items-center gap-2 text-sm"
      >
        {open ? <X size={16} /> : <Wand2 size={16} />}
        <span className="hidden sm:inline">Підбір ракетки</span>
      </button>
    </>
  );
}
