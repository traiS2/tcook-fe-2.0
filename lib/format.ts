import type { Difficulty } from "./data";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function difficultyMeta(d: Difficulty): { num: string; color: string } {
  if (d === "Dễ") return { num: "1", color: "#5a9e56" };
  if (d === "Khó") return { num: "3", color: "#d1544a" };
  return { num: "2", color: "#e8981f" };
}

const CATEGORY_HEAD_BG: Record<string, string> = {
  "Bánh Ngọt": "#f5e9ef",
  "Tráng Miệng": "#f5e9ef",
  "Món Chính": "#f2e8de",
  "Đồ Uống": "#e6f0f4",
  "Ăn Sáng": "#f6efdc",
  "Món Chay": "#e8f1e6",
};

export function categoryHeadColor(cat: string): string {
  return CATEGORY_HEAD_BG[cat] ?? "#f0eeea";
}

const CATEGORY_DOT: Record<string, string> = {
  "Bánh Ngọt": "#c98aa8",
  "Tráng Miệng": "#c98aa8",
  "Món Chính": "#c0895a",
  "Đồ Uống": "#5a9ec0",
  "Ăn Sáng": "#c8a15a",
  "Món Chay": "#5a9e56",
};

export function categoryDotColor(cat: string): string {
  return CATEGORY_DOT[cat] ?? "#8a857d";
}

/** Parses Vietnamese durations like "4 giờ 55 phút" / "45 phút" into minutes. */
export function parseMinutes(t: string): number {
  let m = 0;
  const h = t.match(/(\d+)\s*gi(ờ|o)/);
  const p = t.match(/(\d+)\s*ph(ú|u)t/);
  if (h) m += parseInt(h[1], 10) * 60;
  if (p) m += parseInt(p[1], 10);
  return m || 0;
}

/** Abbreviates Vietnamese durations to match the design's compact stat boxes:
 *  "4 giờ 55 phút" → "4g 55p", "45 phút" → "45p". */
export function shortTime(t: string): string {
  return t.replace(/\s*gi(ờ|o)/g, "g").replace(/\s*ph(ú|u)t/g, "p");
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${pad(m)}:${pad(ss)}`;
}

export function formatQty(value: number, unit: string): string {
  let n = Math.round(value * 10) / 10;
  if (n >= 1) n = Math.round(n);
  return `${n} ${unit}`;
}
