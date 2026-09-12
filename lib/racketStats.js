export const STAT_FIELDS = [
  { key: "attack", label: "Атака" },
  { key: "defense", label: "Захист" },
  { key: "control", label: "Контроль" },
  { key: "versatility", label: "Універсальність" },
];

export function normalizeStats(input) {
  const out = {};
  for (const { key } of STAT_FIELDS) {
    const v = Number(input?.[key]);
    if (Number.isFinite(v)) out[key] = Math.min(10, Math.max(1, Math.round(v)));
  }
  return out;
}
