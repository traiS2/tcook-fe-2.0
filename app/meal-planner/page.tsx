"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useFavorites } from "@/hooks/useFavorites";
import { DAY_LABELS, MEALS, useMealPlan } from "@/hooks/useMealPlan";
import { RECIPES } from "@/lib/data";
import { categoryDotColor } from "@/lib/format";
import { BasketIcon, ChecklistIcon, CloseIcon, HeartIcon, TrashIcon } from "@/components/icons";

export default function MealPlannerPage() {
  const { plan, setSlot, removeSlot, clearPlan } = useMealPlan();
  const { favoriteSlugs } = useFavorites();
  const [over, setOver] = useState<string | null>(null);
  const draggingSlug = useRef<string | null>(null);

  const count = Object.keys(plan).length;
  const hasPlan = count > 0;

  const addToFirstEmpty = (slug: string) => {
    for (let day = 0; day < DAY_LABELS.length; day++) {
      for (const meal of MEALS) {
        const key = `${day}-${meal.id}`;
        if (!plan[key]) {
          setSlot(key, slug);
          return;
        }
      }
    }
  };

  const handleDrop = (key: string, e: React.DragEvent) => {
    e.preventDefault();
    const slug = draggingSlug.current || e.dataTransfer.getData("text/plain");
    draggingSlug.current = null;
    setOver(null);
    if (slug) setSlot(key, slug);
  };

  const orderedPalette = [...RECIPES].sort(
    (a, b) => Number(favoriteSlugs.includes(b.slug)) - Number(favoriteSlugs.includes(a.slug))
  );

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeUtility="meal-planner" />

      <div className="border-t border-black/5 bg-gradient-to-b from-cream-50 to-white">
        <div className="page-px pb-6.5 pt-8.5">
          <div className="mb-4 flex items-center gap-2 text-[12.5px] text-ink-300">
            <Link href="/" className="text-ink-300">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-600">Lịch nấu ăn</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-script text-2xl text-ink-700">Lên thực đơn cả tuần</span>
              <h1 className="mt-0.5 flex items-center gap-3.5 text-[44px] font-bold leading-tight max-sm:text-3xl">
                Lịch Nấu Ăn
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-300 px-4 py-1.5 font-heading text-[15px] font-bold text-ink-800">
                  <ChecklistIcon size={15} />
                  {count} bữa
                </span>
              </h1>
              <p className="mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-ink-500">
                Kéo món từ kho công thức bên phải và thả vào ô ngày · bữa tương ứng. Lịch được lưu tự
                động trên trình duyệt của bạn.
              </p>
            </div>
            {hasPlan && (
              <div className="flex gap-2.5">
                <Link
                  href="/shopping-list"
                  className="inline-flex items-center gap-2 rounded-full bg-cream-300 px-5 py-2.5 font-body text-[13px] font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
                >
                  <BasketIcon size={15} />
                  Danh sách đi chợ
                </Link>
                <button
                  type="button"
                  onClick={clearPlan}
                  className="inline-flex items-center gap-2 rounded-full border border-black/14 bg-white px-5 py-2.5 font-body text-[13px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
                >
                  <TrashIcon size={15} />
                  Xóa lịch
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_290px] items-start gap-6.5 page-px pb-15 pt-7.5 max-lg:grid-cols-1">
        {/* planner grid */}
        <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white p-4 shadow-[0_8px_26px_rgba(0,0,0,0.05)]">
          <div className="grid min-w-[760px] grid-cols-[96px_repeat(7,minmax(96px,1fr))] gap-2">
            <div />
            {DAY_LABELS.map((d) => (
              <div key={d} className="rounded-[10px] bg-cream-100 py-2 text-center font-heading text-[13px] font-bold text-ink-900">
                {d}
              </div>
            ))}
            {MEALS.map((meal) => (
              <div key={meal.id} className="contents">
                <div className="flex flex-col justify-center gap-1 px-2 py-1.5">
                  <span className="text-gold-700">{meal.id === "sang" ? "☀" : meal.id === "trua" ? "🍽" : "🌙"}</span>
                  <span className="font-heading text-[13px] font-bold text-ink-900">{meal.label}</span>
                </div>
                {DAY_LABELS.map((_, dayIndex) => {
                  const key = `${dayIndex}-${meal.id}`;
                  const slot = plan[key];
                  const recipe = slot ? RECIPES.find((r) => r.slug === slot.slug) : undefined;
                  const isOver = over === key;
                  return (
                    <div
                      key={key}
                      onDrop={(e) => handleDrop(key, e)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "copy";
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setOver(key);
                      }}
                      onDragLeave={() => setOver((prev) => (prev === key ? null : prev))}
                      className="flex min-h-24 rounded-[11px] border-[1.5px] border-dashed p-1.5"
                      style={{
                        borderColor: isOver ? "#c8a15a" : recipe ? "transparent" : "rgba(0,0,0,.12)",
                        background: isOver ? "#f6efdc" : recipe ? "#faf9f7" : "#fbfaf8",
                      }}
                    >
                      {recipe ? (
                        <div className="relative flex flex-1 flex-col gap-1.5 rounded-[9px] border border-black/8 bg-white p-2.5 shadow-[0_3px_10px_rgba(0,0,0,0.05)]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 flex-none rounded-full"
                              style={{ background: categoryDotColor(recipe.category) }}
                            />
                            <span className="truncate font-body text-[10px] font-semibold uppercase tracking-[0.03em] text-ink-300">
                              {recipe.category}
                            </span>
                          </div>
                          <div className="line-clamp-2 font-body text-xs font-semibold leading-tight text-ink-800">
                            {recipe.name}
                          </div>
                          <div className="flex items-center gap-1 text-[10.5px] text-ink-300">{recipe.time}</div>
                          <button
                            type="button"
                            aria-label="Bỏ khỏi lịch"
                            onClick={() => removeSlot(key)}
                            className="absolute right-1.5 top-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-md bg-cream-100 text-ink-200"
                          >
                            <CloseIcon size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center justify-center text-ink-50">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* palette */}
        <aside className="sticky top-4 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_26px_rgba(0,0,0,0.05)]">
          <div className="border-b border-black/6 px-4.5 py-4">
            <h3 className="text-[17px]">Kho công thức</h3>
            <p className="mt-0.5 text-xs text-ink-300">Kéo thả vào lịch, hoặc nhấn để thêm vào ô trống gần nhất.</p>
          </div>
          <div className="flex max-h-[560px] flex-col gap-2.5 overflow-y-auto p-3">
            {orderedPalette.map((r) => (
              <div
                key={r.slug}
                draggable
                onDragStart={(e) => {
                  draggingSlug.current = r.slug;
                  e.dataTransfer.setData("text/plain", r.slug);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onDragEnd={() => (draggingSlug.current = null)}
                onClick={() => addToFirstEmpty(r.slug)}
                className="flex cursor-grab items-center gap-2.5 rounded-xl border border-black/7 bg-cream-50 px-2.5 py-2.5 active:cursor-grabbing"
              >
                <span
                  className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-[9px] text-white"
                  style={{ background: categoryDotColor(r.category) }}
                >
                  <BasketIcon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-body text-[12.5px] font-semibold text-ink-800">{r.name}</div>
                  <div className="text-[11px] text-ink-300">
                    {r.category} · {r.time}
                  </div>
                </div>
                {favoriteSlugs.includes(r.slug) && (
                  <span className="flex-none text-[#e2574c]">
                    <HeartIcon size={13} fill="currentColor" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <SiteFooter active="Lịch nấu ăn" />
    </div>
  );
}
