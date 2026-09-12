"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Wand2, RotateCcw, ArrowRight, ImageOff } from "lucide-react";
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
];

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

function pickBestRacket(rackets, totals) {
  let best = null;
  let bestScore = -Infinity;
  for (const p of rackets) {
    let score = 0;
    for (const key of Object.keys(totals)) {
      score += totals[key] * (p.stats?.[key] || 5);
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

export default function RacketQuiz({ products }) {
  const rackets = useMemo(
    () => products.filter((p) => p.category === "Ракетки" && p.stats && Object.keys(p.stats).length > 0),
    [products]
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const root = useRef(null);
  const { addItem } = useCart();

  useGSAP(
    () => {
      if (!root.current) return;
      gsap.from(root.current.querySelector("[data-quiz-panel]"), {
        opacity: 0,
        y: 10,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    { scope: root, dependencies: [step, answers.length] }
  );

  if (rackets.length === 0) return null;

  const done = answers.length === QUESTIONS.length;
  const result = done
    ? pickBestRacket(
        rackets,
        answers.reduce((acc, a) => {
          for (const [k, v] of Object.entries(a)) acc[k] = (acc[k] || 0) + v;
          return acc;
        }, {})
      )
    : null;

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
    <section ref={root} className="max-w-4xl mx-auto px-5 md:px-7 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-gold/10 border border-gold/25 text-gold px-4 py-1.5 rounded-full mb-4">
          <Wand2 size={14} /> Тест підбору ракетки
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Яка ракетка підійде саме тобі?</h2>
        <p className="text-cream/60 mt-2 max-w-lg mx-auto">
          Дай відповідь на 3 короткі питання про свій стиль гри — і ми підберемо найкращу ракетку з каталогу.
        </p>
      </div>

      <div data-quiz-panel className="card p-6 md:p-8">
        {!done ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-gradient-to-r from-orange to-gold" : "bg-white/10"}`}
                />
              ))}
            </div>
            <h3 className="text-lg font-bold text-white mb-5">{QUESTIONS[step].question}</h3>
            <div className="flex flex-col gap-3">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => choose(opt.weights)}
                  className="text-left px-5 py-3.5 rounded-xl bg-white/5 border border-line hover:border-orange/50 hover:bg-orange/10 transition-colors text-cream/90 font-semibold"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Link
              href={`/product/${result.id}`}
              className="shrink-0 w-full md:w-48 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-bg3 to-bg2 flex items-center justify-center"
            >
              {result.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.images[0]} alt={result.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={28} className="text-cream/30" />
              )}
            </Link>
            <div className="flex-1 w-full">
              <div className="text-xs text-cream/50 font-semibold uppercase tracking-wide mb-1">Тобі підійде</div>
              <Link href={`/product/${result.id}`} className="text-xl font-extrabold text-white hover:text-orange2 transition-colors">
                {result.name}
              </Link>
              <RacketStatBars stats={result.stats} />
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <span className="text-lg font-extrabold text-white">{money(result.price)}</span>
                <button onClick={() => addItem(result, 1)} className="btn-primary px-5 py-2.5 inline-flex items-center gap-2">
                  Додати в кошик <ArrowRight size={16} />
                </button>
                <button
                  onClick={reset}
                  className="btn-ghost px-4 py-2.5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  <RotateCcw size={14} /> Пройти ще раз
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
