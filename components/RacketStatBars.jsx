import { STAT_FIELDS } from "../lib/racketStats.js";
import { useLang } from "../context/LanguageContext.jsx";

export default function RacketStatBars({ stats, compact = false }) {
  const { t } = useLang();
  const entries = STAT_FIELDS.filter((f) => stats?.[f.key]);
  if (entries.length === 0) return null;

  return (
    <div className={compact ? "flex flex-col gap-1.5 mt-3" : "flex flex-col gap-2.5 mt-4"}>
      {entries.map((f) => (
        <div key={f.key} className="flex items-center gap-2">
          <span className={`text-cream/60 font-semibold shrink-0 ${compact ? "text-[10px] w-[72px]" : "text-xs w-[104px]"}`}>
            {t(`stats.${f.key}`)}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange to-gold"
              style={{ width: `${stats[f.key] * 10}%` }}
            />
          </div>
          <span className={`text-cream/70 font-bold tabular-nums shrink-0 ${compact ? "text-[10px] w-3.5" : "text-xs w-4"}`}>
            {stats[f.key]}
          </span>
        </div>
      ))}
    </div>
  );
}
