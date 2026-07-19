"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentViews } from "@/hooks/useRecentViews";
import { getRecipeBySlug } from "@/lib/data";
import { categoryHeadColor, difficultyMeta, formatClock, parseMinutes } from "@/lib/format";
import {
  DETAIL_RECIPE_SLUG,
  INGREDIENT_GROUPS,
  RECIPE_REVIEWS,
  RECIPE_STEPS,
  RECIPE_STORAGE,
  RECIPE_TIPS,
  RELATED_RECIPES,
} from "@/lib/recipeDetail";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoxIcon,
  CalendarIcon,
  ChecklistIcon,
  ChefHatIcon,
  ClockIcon,
  CloseIcon,
  CommentIcon,
  CopyIcon,
  EyeIcon,
  FacebookIcon,
  HeartIcon,
  InstagramIcon,
  LightbulbIcon,
  ListIcon,
  ShareIcon,
  StarIcon,
} from "@/components/icons";

const recipe = getRecipeBySlug(DETAIL_RECIPE_SLUG)!;

function ingredientKey(groupIndex: number, itemIndex: number) {
  return `${groupIndex}-${itemIndex}`;
}

export default function RecipeDetailPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { recordView } = useRecentViews();

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [cookOpen, setCookOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeTotal, setTimeTotal] = useState(0);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(() => {
    recordView(DETAIL_RECIPE_SLUG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestWakeLock = () => {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
      nav.wakeLock?.request("screen").then((w) => (wakeLockRef.current = w)).catch(() => {});
    } catch {
      // wake lock unsupported — ignore
    }
  };
  const releaseWakeLock = () => {
    try {
      wakeLockRef.current?.release?.();
      wakeLockRef.current = null;
    } catch {
      // ignore
    }
  };

  const stepSeconds = (i: number) => parseMinutes(RECIPE_STEPS[i].time) * 60 || 60;

  const openCookMode = () => {
    const t = stepSeconds(0);
    setCookOpen(true);
    setStepIndex(0);
    setTimeTotal(t);
    setTimeRemaining(t);
    setTimerRunning(false);
    requestWakeLock();
  };
  const closeCookMode = () => {
    setCookOpen(false);
    setTimerRunning(false);
    releaseWakeLock();
  };
  const gotoStep = (i: number) => {
    const n = RECIPE_STEPS.length;
    const next = Math.max(0, Math.min(n - 1, i));
    const t = stepSeconds(next);
    setStepIndex(next);
    setTimeTotal(t);
    setTimeRemaining(t);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (!cookOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCookMode();
      else if (e.key === "ArrowRight") gotoStep(stepIndex + 1);
      else if (e.key === "ArrowLeft") gotoStep(stepIndex - 1);
      else if (e.key === " ") {
        e.preventDefault();
        setTimerRunning((r) => !r);
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookOpen, stepIndex]);

  useEffect(() => {
    if (!cookOpen || !timerRunning) return;
    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cookOpen, timerRunning]);

  useEffect(() => () => releaseWakeLock(), []);

  const allKeys = useMemo(
    () => INGREDIENT_GROUPS.flatMap((g, gi) => g.items.map((_, ii) => ingredientKey(gi, ii))),
    []
  );
  const doneCount = allKeys.filter((k) => checked[k]).length;

  const toggleIngredient = (key: string) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  const checkAll = () => {
    const allOn = allKeys.every((k) => checked[k]);
    setChecked(allOn ? {} : Object.fromEntries(allKeys.map((k) => [k, true])));
  };

  const copyIngredients = () => {
    const txt = INGREDIENT_GROUPS.map((g) => `${g.title}\n${g.items.map((i) => `- ${i}`).join("\n")}`).join(
      "\n\n"
    );
    try {
      navigator.clipboard?.writeText(txt);
    } catch {
      // clipboard unavailable — ignore
    }
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1600);
  };

  const isFav = isFavorite(DETAIL_RECIPE_SLUG);
  const currentStep = RECIPE_STEPS[stepIndex];
  const ckProgress = Math.round(((stepIndex + 1) / RECIPE_STEPS.length) * 100);

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeNav="recipes" />

      {/* hero */}
      <div className="border-t border-black/5 bg-gradient-to-b from-cream-50 to-white">
        <Reveal className="page-px pb-3 pt-6.5">
          <div className="flex items-center gap-2 text-[12.5px] text-ink-300">
            <Link href="/" className="text-ink-300">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/recipes" className="text-ink-300">
              Công thức
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-600">{recipe.name}</span>
          </div>
        </Reveal>
        <Reveal className="grid grid-cols-[1.02fr_1.1fr] items-center gap-11 page-px pb-13 pt-2 max-lg:grid-cols-1">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-cream-200 px-3 py-1.5 font-body text-xs font-semibold text-ink-600">
                {recipe.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-gold-300 bg-gold-100 px-3 py-1.5 font-body text-xs font-bold text-gold-700">
                <StarIcon size={12} />
                Nổi bật
              </span>
            </div>
            <span className="font-script text-[26px] text-ink-700">Không cần lò nướng · vintage</span>
            <h1 className="mt-1 text-5xl font-bold leading-[1.05] tracking-tight max-sm:text-4xl">
              Bánh Tiramisu
              <br />
              Việt Quất
            </h1>
            <p className="mt-4 max-w-[460px] text-[15px] leading-relaxed text-ink-500">
              Lớp mứt việt quất chua ngọt tự sên hòa quyện kem phô mai Mascarpone béo ngậy, xen bánh quy
              sâm banh thấm sữa — mềm mịn, tan ngay đầu lưỡi.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px] text-ink-600">
              <span className="flex items-center gap-1.5">
                <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-cream-300 text-ink-800">
                  <ChefHatIcon size={15} />
                </span>
                <span className="font-semibold">{recipe.author}</span>
              </span>
              <span className="flex items-center gap-1.5 text-ink-300">
                <CalendarIcon size={14} />
                {recipe.date}
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-gold-700">
                <StarIcon size={14} />
                {recipe.rating}
              </span>
              <span className="font-medium text-ink-300">3 đánh giá</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-[12.5px] text-ink-300">
              <span className="flex items-center gap-1.5">
                <EyeIcon size={15} />
                {recipe.views} lượt xem
              </span>
              <span className="flex items-center gap-1.5">
                <HeartIcon size={15} />
                {recipe.likes} lượt tim
              </span>
              <span className="flex items-center gap-1.5">
                <CommentIcon size={15} />3 bình luận
              </span>
            </div>
            <div className="mt-4.5 flex flex-wrap gap-2">
              {recipe.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-black/5 bg-cream-100 px-2.5 py-1.5 font-body text-xs font-medium text-ink-600"
                >
                  #{t}
                </span>
              ))}
            </div>
            <div className="mt-6.5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openCookMode}
                className="inline-flex items-center gap-2 rounded-full bg-cream-300 px-6 py-3.5 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
              >
                <ChefHatIcon size={18} />
                Bắt đầu nấu
              </button>
              <a
                href="#recipe-ingredients"
                className="inline-flex items-center gap-2 rounded-full border border-black/14 bg-white px-6 py-3.5 font-body text-sm font-semibold text-ink-900 transition-transform hover:-translate-y-0.5"
              >
                <ListIcon size={18} />
                Xuống nguyên liệu
              </a>
              <button
                type="button"
                onClick={() => toggleFavorite(DETAIL_RECIPE_SLUG)}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-body text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                  isFav ? "border-red-300 bg-red-100 text-red-600" : "border-black/14 bg-white text-ink-900"
                }`}
              >
                <HeartIcon size={18} fill={isFav ? "currentColor" : "none"} />
                {isFav ? "Đã lưu" : "Yêu thích"}
              </button>
            </div>
          </div>
          <div className="relative">
            <Placeholder
              label={recipe.imageLabel}
              className="rounded-[22px] shadow-[0_30px_60px_rgba(0,0,0,0.14)]"
              style={{ aspectRatio: "4 / 3.2" }}
            />
            <div className="absolute bottom-5.5 right-4 flex items-center gap-2.5 rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.12)]">
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-cream-300 text-ink-800">
                <ClockIcon size={18} />
              </span>
              <div>
                <div className="font-heading text-[15px] font-bold text-ink-900">4g 55p</div>
                <div className="text-[11px] text-ink-300">Tổng thời gian</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* meta stat strip */}
      <Reveal className="page-px">
        <div className="grid -translate-y-6.5 grid-cols-6 gap-3 max-md:grid-cols-3 max-sm:grid-cols-2">
          <StatCard label="Chuẩn bị" value="45p" />
          <StatCard label="Nấu" value="10p" />
          <StatCard label="Tổng" value="4g 55p" highlight />
          <StatCard label="Khẩu phần" value={recipe.serve} />
          <StatCard label="Độ khó" value={recipe.difficulty} />
          <StatCard label="Đánh giá" value={recipe.rating} icon={<StarIcon size={17} className="text-gold-700" />} />
        </div>
      </Reveal>

      {/* quick jump nav */}
      <Reveal className="page-px pb-1.5">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/7 bg-white p-3 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
          <span className="mr-1 font-body text-[12.5px] font-semibold text-ink-300">Đi nhanh đến:</span>
          {[
            { href: "#recipe-ingredients", label: "Nguyên liệu" },
            { href: "#recipe-instructions", label: "Cách làm" },
            { href: "#recipe-tips", label: "Mẹo hay" },
            { href: "#recipe-storage", label: "Bảo quản" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full bg-cream-100 px-4 py-2 font-body text-[12.5px] font-semibold text-ink-600"
            >
              {l.label}
            </a>
          ))}
        </div>
      </Reveal>

      {/* before you start */}
      <Reveal className="page-px py-1.5">
        <div className="rounded-2xl border border-black/6 bg-cream-50 p-7">
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border border-black/6 bg-white text-gold-700">
              <LightbulbIcon size={18} />
            </span>
            <h2 className="text-[23px]">Trước khi bắt đầu</h2>
          </div>
          <p className="mb-4.5 ml-11 text-[13.5px] text-ink-300">Đọc nhanh các điểm mấu chốt trước khi vào bếp.</p>
          <div className="grid grid-cols-3 gap-3.5 max-sm:grid-cols-1">
            {RECIPE_TIPS.map((t) => (
              <div key={t.title} className="rounded-2xl border border-black/6 bg-white p-5">
                <div className="mb-1.5 font-heading text-sm font-bold text-ink-900">{t.title.replace(":", "")}</div>
                <p className="text-[13px] leading-relaxed text-ink-500">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* main two-column */}
      <div className="grid grid-cols-[1fr_350px] items-start gap-8.5 page-px py-8.5 max-lg:grid-cols-1">
        <div id="recipe-instructions">
          <Reveal className="mb-5.5 flex items-end justify-between">
            <div>
              <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
                Hướng dẫn
              </span>
              <h2 className="mt-1.5 text-[30px] font-bold">Cách Làm</h2>
            </div>
            <span className="text-[13px] text-ink-300">{RECIPE_STEPS.length} bước</span>
          </Reveal>
          <div className="flex flex-col gap-4.5">
            {RECIPE_STEPS.map((s) => (
              <Reveal key={s.num}>
                <div className="grid grid-cols-[1fr_300px] overflow-hidden rounded-2xl border border-black/7 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] max-sm:grid-cols-1">
                  <div className="p-6.5">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-[11px] bg-cream-300 font-heading text-lg font-bold text-ink-800">
                        {s.num}
                      </span>
                      <div>
                        <h3 className="text-[21px]">{s.title}</h3>
                        <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-300">
                          <ClockIcon size={12} />
                          {s.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-600">{s.description}</p>
                  </div>
                  <Placeholder label={s.imageLabel} className="min-h-47.5" />
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal id="recipe-tips" className="mt-7.5 rounded-2xl border border-black/6 bg-cream-50 p-7">
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border border-black/6 bg-white text-gold-700">
                <LightbulbIcon size={18} />
              </span>
              <h2 className="text-[23px]">Mẹo Hay</h2>
            </div>
            <div className="flex flex-col gap-3">
              {RECIPE_TIPS.map((t) => (
                <div key={t.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-none text-gold-700">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-ink-600">
                    <b className="text-ink-900">{t.title}</b> {t.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal id="recipe-storage" className="mt-4.5">
            <div className="rounded-2xl border border-black/7 bg-white p-6.5">
              <div className="mb-3.5 flex items-center gap-2 text-ink-600">
                <BoxIcon size={18} />
                <h4 className="text-[17px]">Bảo quản</h4>
              </div>
              <div className="flex flex-col gap-2.5">
                {RECIPE_STORAGE.map((s) => (
                  <div key={s.title} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-none text-gold-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <p className="text-[13.5px] leading-relaxed text-ink-600">
                      <b className="text-ink-900">{s.title}</b> {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ingredients sidebar */}
        <Reveal id="recipe-ingredients" className="sticky top-4 rounded-2xl border border-black/8 bg-white p-5.5 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[22px]">Nguyên Liệu</h2>
            <span className="text-xs text-ink-300">
              {doneCount}/{allKeys.length}
            </span>
          </div>
          <p className="mb-3.5 text-[12.5px] text-ink-300">Khẩu phần {recipe.serve}</p>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={copyIngredients}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-cream-100 py-2.5 font-body text-[12.5px] font-semibold text-ink-600"
            >
              <CopyIcon size={14} />
              {copied ? "Đã copy!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={checkAll}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-cream-100 py-2.5 font-body text-[12.5px] font-semibold text-ink-600"
            >
              <ChecklistIcon size={14} />
              Đánh dấu hết
            </button>
          </div>
          <div className="flex flex-col gap-4.5">
            {INGREDIENT_GROUPS.map((g, gi) => (
              <div key={g.title}>
                <h4 className="mb-1.5 text-[13px] uppercase tracking-[0.06em] text-ink-300">{g.title}</h4>
                <div className="flex flex-col">
                  {g.items.map((item, ii) => {
                    const key = ingredientKey(gi, ii);
                    const on = !!checked[key];
                    return (
                      <label
                        key={key}
                        onClick={() => toggleIngredient(key)}
                        className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13.5px] text-ink-700 hover:bg-cream-100"
                      >
                        {on ? (
                          <span className="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md bg-cream-300">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2c2a26" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        ) : (
                          <span className="h-[19px] w-[19px] flex-none rounded-md border-[1.5px] border-ink-100" />
                        )}
                        <span className={on ? "text-ink-200 line-through" : ""}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={openCookMode}
            className="mt-4.5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-cream-300 py-3 font-body text-[13.5px] font-semibold text-ink-800"
          >
            Bắt đầu nấu <ArrowRightIcon size={15} />
          </button>
          <div className="mt-4.5 border-t border-black/6 pt-4">
            <p className="mb-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-200">
              Chia sẻ
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="flex items-center gap-1.5 rounded-[9px] border border-black/10 px-3.5 py-2 font-body text-[12.5px] font-medium text-ink-700">
                <FacebookIcon size={13} />
                Facebook
              </a>
              <a href="#" className="flex items-center gap-1.5 rounded-[9px] border border-black/10 px-3.5 py-2 font-body text-[12.5px] font-medium text-ink-700">
                <InstagramIcon size={13} />
                Instagram
              </a>
              <a href="#" className="flex items-center gap-1.5 rounded-[9px] border border-black/10 px-3.5 py-2 font-body text-[12.5px] font-medium text-ink-700">
                <ShareIcon size={13} />
                Sao chép
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      {/* reviews */}
      <Reveal className="page-px py-3.5">
        <div className="mb-4.5 flex items-center gap-2.5">
          <span className="flex h-8.5 w-8.5 items-center justify-center rounded-[10px] border border-black/6 bg-white text-gold-700">
            <StarIcon size={18} />
          </span>
          <h2 className="text-[23px]">Đánh Giá & Bình Luận</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-black/6 bg-cream-50">
          <div className="flex flex-col gap-5 p-7">
            <div>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h4 className="mb-4 text-[14.5px] font-semibold text-ink-700">Để lại đánh giá của bạn</h4>
                  <div className="flex gap-1.5 text-gold-700">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={24} fill="none" className="stroke-2" />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-3xl font-bold leading-none text-ink-900">5.0</div>
                  <div className="my-1.5 flex justify-end gap-0.5 text-gold-700">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} size={13} />
                    ))}
                  </div>
                  <div className="text-[11.5px] text-ink-300">Dựa trên 3 đánh giá</div>
                </div>
              </div>
              <div className="min-h-16 rounded-[11px] border border-black/7 bg-[#f0ede8] px-4 py-3.5 text-[13.5px] text-ink-200">
                Chia sẻ cảm nhận của bạn về công thức này...
              </div>
              <div className="mt-3 flex justify-end">
                <span className="rounded-[10px] bg-cream-300 px-5 py-2.5 font-body text-[13px] font-semibold text-ink-800">
                  Gửi đánh giá
                </span>
              </div>
            </div>
            <div className="border-t border-black/6" />
            <div className="flex flex-col gap-4">
              {RECIPE_REVIEWS.map((r) => (
                <div key={r.name} className="flex gap-3">
                  <div
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-full font-body text-sm font-bold"
                    style={{ background: r.avatarBg, color: r.avatarColor }}
                  >
                    {r.initial}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2.5">
                      <span className="font-body text-[13.5px] font-semibold text-ink-800">{r.name}</span>
                      <div className="flex gap-0.5 text-gold-700">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon key={i} size={12} fill={i < r.stars ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-[11.5px] text-ink-100">{r.timeAgo}</span>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-[#5a554f]">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* cook mode overlay */}
      {cookOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-cream-50">
          <div className="flex items-center justify-between border-b border-black/7 bg-white px-6.5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-cream-300 text-ink-800">
                <ChefHatIcon size={20} />
              </span>
              <div>
                <div className="font-heading text-[15px] font-bold text-ink-900">Chế độ nấu</div>
                <div className="text-xs text-ink-300">{recipe.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-[13px] font-semibold text-ink-600">
                Bước {stepIndex + 1}/{RECIPE_STEPS.length}
              </span>
              <button
                type="button"
                onClick={closeCookMode}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-black/6 bg-cream-100 px-3.5 py-2 font-body text-[13px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
              >
                Thoát <CloseIcon size={14} />
              </button>
            </div>
          </div>
          <div className="h-1 bg-[#eceae5]">
            <div className="h-full bg-[#c8a15a] transition-[width]" style={{ width: `${ckProgress}%` }} />
          </div>
          <div className="grid flex-1 grid-cols-[1.1fr_0.9fr] items-center gap-11 overflow-auto p-11 max-lg:grid-cols-1" style={{ paddingLeft: "max(40px, calc((100% - 1120px) / 2))", paddingRight: "max(40px, calc((100% - 1120px) / 2))" }}>
            <div className="[animation:ckin_0.4s_cubic-bezier(0.22,0.61,0.36,1)_both]">
              <div className="mb-4.5 flex items-center gap-3.5">
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-cream-300 font-heading text-2xl font-bold text-ink-800">
                  {stepIndex + 1}
                </span>
                <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
                  Bước hiện tại
                </span>
              </div>
              <h2 className="text-[42px] font-bold leading-tight">{currentStep.title}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-600">{currentStep.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4.5 rounded-2xl border border-black/7 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3">
                  <span className="text-gold-700">
                    <ClockIcon size={26} />
                  </span>
                  <div className="font-heading text-[42px] font-bold tabular-nums tracking-wide text-ink-900">
                    {formatClock(timeRemaining)}
                  </div>
                </div>
                <div className="flex flex-1 flex-wrap justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="inline-flex items-center gap-1.5 rounded-[11px] bg-cream-300 px-4.5 py-2.5 font-body text-[13.5px] font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
                  >
                    {timerRunning ? "Tạm dừng" : timeRemaining < timeTotal ? "Tiếp tục" : "Bắt đầu hẹn giờ"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeRemaining(timeTotal);
                      setTimerRunning(false);
                    }}
                    className="rounded-[11px] bg-cream-100 px-4 py-2.5 font-body text-[13.5px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
                  >
                    Đặt lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRemaining((prev) => prev + 60)}
                    className="rounded-[11px] bg-cream-100 px-4 py-2.5 font-body text-[13.5px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
                  >
                    +1 phút
                  </button>
                </div>
              </div>
            </div>
            <Placeholder
              label={currentStep.imageLabel}
              className="rounded-[22px] shadow-[0_30px_60px_rgba(0,0,0,0.14)]"
              style={{ aspectRatio: "4 / 3.4" }}
            />
          </div>
          <div className="flex items-center justify-between border-t border-black/7 bg-white px-6.5 py-4.5">
            <button
              type="button"
              onClick={() => gotoStep(stepIndex - 1)}
              style={{ opacity: stepIndex === 0 ? 0.4 : 1 }}
              className="inline-flex items-center gap-2 rounded-[11px] border border-black/6 bg-cream-100 px-5 py-3 font-body text-[13.5px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
            >
              <ArrowLeftIcon size={16} />
              Bước trước
            </button>
            <div className="flex items-center gap-2">
              {RECIPE_STEPS.map((s, i) => (
                <span
                  key={s.num}
                  onClick={() => gotoStep(i)}
                  className="h-2.5 cursor-pointer rounded-full transition-all"
                  style={{
                    width: i === stepIndex ? 26 : 9,
                    background: i === stepIndex ? "#c8a15a" : i < stepIndex ? "#d8c39a" : "#dcd7ce",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => (stepIndex >= RECIPE_STEPS.length - 1 ? closeCookMode() : gotoStep(stepIndex + 1))}
              className="inline-flex items-center gap-2 rounded-[11px] bg-cream-300 px-5.5 py-3 font-body text-[13.5px] font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
            >
              {stepIndex >= RECIPE_STEPS.length - 1 ? "Hoàn thành" : "Bước tiếp"}
              <ArrowRightIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* related */}
      <Reveal className="page-px py-2">
        <div className="mb-5.5 flex items-end justify-between">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
              Có thể bạn cũng thích
            </span>
            <h2 className="mt-2 text-[32px] font-bold">Món Tương Tự</h2>
          </div>
          <Link href="/recipes" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-ink-900">
            Tất cả công thức <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {RELATED_RECIPES.map((r) => {
            const diff = difficultyMeta(r.difficulty);
            return (
              <Link
                key={r.name}
                href="/recipes"
                className="flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_16px_34px_rgba(0,0,0,0.10)]"
              >
                <div className="flex h-24 items-start justify-between p-3.5" style={{ background: categoryHeadColor(r.category) }}>
                  <span className="rounded-lg bg-white px-2.5 py-1.5 font-body text-[11px] font-semibold text-ink-600 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                    {r.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-body text-[11px] font-bold text-gold-700 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                    <StarIcon size={12} />
                    {r.rating}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <span className="w-fit rounded-full bg-cream-300 px-2.5 py-1 font-body text-[10.5px] font-semibold text-[#5a4e3a]">
                    {r.tag}
                  </span>
                  <h4 className="text-[17px] font-bold leading-tight text-ink-900">{r.name}</h4>
                  <div className="flex flex-wrap gap-3 text-[11.5px] text-ink-600">
                    <span className="flex items-center gap-1.5">
                      <ClockIcon size={13} />
                      {r.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {r.serve}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: diff.color }} />
                      {r.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>

      <SiteFooter active="Công thức" />
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center shadow-[0_8px_22px_rgba(0,0,0,0.05)] ${
        highlight ? "border-black/5 bg-cream-300" : "border-black/7 bg-white"
      }`}
    >
      <div className={`mb-1.5 flex justify-center ${highlight ? "text-ink-800" : "text-ink-300"}`}>
        {icon ?? <ClockIcon size={17} />}
      </div>
      <div className={`text-[11px] ${highlight ? "text-ink-800/55" : "text-ink-300"}`}>{label}</div>
      <div className={`font-heading text-[17px] font-bold ${highlight ? "text-ink-800" : "text-ink-900"}`}>
        {value}
      </div>
    </div>
  );
}
