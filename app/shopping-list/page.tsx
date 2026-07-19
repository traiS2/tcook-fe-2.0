"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useShoppingChecklist } from "@/hooks/useShoppingChecklist";
import { AISLE_META, getRecipeBySlug, SHOPPING_INGREDIENTS, type Aisle } from "@/lib/data";
import { categoryDotColor, formatQty } from "@/lib/format";
import { ArrowRightIcon, CheckIcon, CopyIcon, RotateCcwIcon, ShoppingBagIcon } from "@/components/icons";

const PRESETS = [2, 4, 6, 8];

interface AggItem {
  key: string;
  name: string;
  unit: string;
  aisle: Aisle;
  qty: number;
}

export default function ShoppingListPage() {
  const { plan } = useMealPlan();
  const { checked, toggle, resetChecks, servings, setServings } = useShoppingChecklist();
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  // 1. Count how many plan slots use each recipe slug.
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    Object.values(plan).forEach((slot) => {
      if (slot) c[slot.slug] = (c[slot.slug] || 0) + 1;
    });
    return c;
  }, [plan]);

  // 2. Scale ingredients by (servings / base) * timesUsed and accumulate by name|unit.
  const aggregated = useMemo(() => {
    const map: Record<string, AggItem> = {};
    Object.keys(counts).forEach((slug) => {
      const rec = SHOPPING_INGREDIENTS[slug];
      if (!rec) return;
      const factor = (servings / rec.base) * counts[slug];
      rec.items.forEach((it) => {
        const key = `${it.name}|${it.unit}`;
        if (!map[key]) map[key] = { key, name: it.name, unit: it.unit, aisle: it.aisle, qty: 0 };
        map[key].qty += it.qty * factor;
      });
    });
    return map;
  }, [counts, servings]);

  const aisleGroups = useMemo(() => {
    const byAisle: Partial<Record<Aisle, AggItem[]>> = {};
    Object.values(aggregated).forEach((it) => {
      (byAisle[it.aisle] ??= []).push(it);
    });
    return (Object.keys(byAisle) as Aisle[])
      .sort((a, b) => AISLE_META[a].order - AISLE_META[b].order)
      .map((aisle) => ({
        aisle,
        meta: AISLE_META[aisle],
        items: [...(byAisle[aisle] ?? [])].sort((a, b) => a.name.localeCompare(b.name, "vi")),
      }));
  }, [aggregated]);

  const totalItems = Object.keys(aggregated).length;
  const boughtCount = Object.keys(aggregated).filter((k) => checked[k]).length;
  const progressPct = totalItems ? Math.round((boughtCount / totalItems) * 100) : 0;

  const planRecipes = useMemo(
    () =>
      Object.keys(counts).map((slug) => {
        const recipe = getRecipeBySlug(slug);
        return {
          slug,
          name: recipe?.name ?? slug,
          category: recipe?.category ?? "",
          count: counts[slug],
          dot: categoryDotColor(recipe?.category ?? ""),
        };
      }),
    [counts]
  );

  const handleCopy = () => {
    let text = `Danh sách đi chợ TCook — ${servings} người\n\n`;
    aisleGroups.forEach((group) => {
      text += `${group.meta.name}:\n`;
      group.items.forEach((it) => {
        text += `  - ${it.name}: ${formatQty(it.qty, it.unit)}\n`;
      });
      text += `\n`;
    });
    try {
      navigator.clipboard?.writeText(text.trim());
    } catch {
      // ignore clipboard errors
    }
    setCopied(true);
    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader />

      {/* hero */}
      <div className="border-t border-black/5 bg-gradient-to-b from-cream-50 to-white">
        <div className="page-px pb-6.5 pt-8.5">
          <div className="mb-4 flex items-center gap-2 text-[12.5px] text-ink-300">
            <Link href="/" className="text-ink-300">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/meal-planner" className="text-ink-300">
              Lịch nấu ăn
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-600">Đi chợ</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-script text-2xl text-ink-700">Chuẩn bị nguyên liệu</span>
              <h1 className="mt-0.5 flex items-center gap-3.5 text-[44px] font-bold leading-tight max-sm:text-3xl">
                Danh Sách Đi Chợ
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-300 px-4 py-1.5 font-heading text-[15px] font-bold text-ink-800">
                  <ShoppingBagIcon size={15} />
                  {totalItems} món
                </span>
              </h1>
              <p className="mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-ink-500">
                Tự động gom nguyên liệu từ lịch nấu ăn của bạn. Chỉnh khẩu phần để cập nhật số lượng,
                tích vào món đã mua.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="page-px pt-5.5">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-black/8 bg-white px-5 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <div className="mb-1.75 font-body text-xs font-semibold text-ink-300">Khẩu phần</div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setServings(servings - 1)}
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] border border-black/14 bg-white font-heading text-base font-bold text-ink-600 transition-colors hover:border-cream-300 hover:bg-cream-300 hover:text-ink-800"
                >
                  −
                </button>
                <div className="min-w-26 rounded-[10px] bg-cream-100 px-2.5 py-1.75 text-center font-heading text-[15px] font-bold text-ink-900">
                  {servings} người
                </div>
                <button
                  type="button"
                  onClick={() => setServings(servings + 1)}
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] border border-black/14 bg-white font-heading text-base font-bold text-ink-600 transition-colors hover:border-cream-300 hover:bg-cream-300 hover:text-ink-800"
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-11 w-px bg-black/8" />
            <div>
              <div className="mb-1.75 font-body text-xs font-semibold text-ink-300">Nhân nhanh</div>
              <div className="flex gap-1.75">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setServings(p)}
                    className={`cursor-pointer rounded-full border px-4 py-2 font-body text-[13px] font-semibold transition-colors ${
                      servings === p
                        ? "border-ink-800 bg-ink-800 text-white"
                        : "border-black/12 bg-white text-ink-600 hover:border-gold-700 hover:text-ink-900"
                    }`}
                  >
                    {p} người
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-body text-[13px] font-semibold text-ink-600">
              {boughtCount}/{totalItems} đã mua
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.75 rounded-[10px] border border-black/14 bg-white px-3.75 py-2.5 font-body text-[13px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
            >
              <CopyIcon size={15} />
              {copied ? "Đã copy!" : "Copy"}
            </button>
            <button
              type="button"
              onClick={resetChecks}
              className="inline-flex items-center gap-1.75 rounded-[10px] bg-cream-300 px-3.75 py-2.5 font-body text-[13px] font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
            >
              <RotateCcwIcon size={15} />
              Bỏ tích
            </button>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="mx-0.5 mt-3.5 h-1.5 overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-green-600 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* body */}
      <div className="grid grid-cols-[1fr_300px] items-start gap-6.5 page-px pb-15 pt-6 max-lg:grid-cols-1">
        {/* list */}
        <div>
          {totalItems > 0 ? (
            <div className="flex flex-col gap-4.5">
              {aisleGroups.map((group) => (
                <div
                  key={group.aisle}
                  className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-2.5 border-b border-black/6 bg-cream-50 px-4.5 py-3.25">
                    <span
                      className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-[9px] text-[15px] text-white"
                      style={{ background: group.meta.color }}
                    >
                      {group.meta.icon}
                    </span>
                    <h3 className="flex-1 text-base">{group.meta.name}</h3>
                    <span className="font-body text-xs font-semibold text-ink-300">
                      {group.items.length} món
                    </span>
                  </div>
                  <div>
                    {group.items.map((it) => {
                      const isChecked = !!checked[it.key];
                      return (
                        <div
                          key={it.key}
                          onClick={() => toggle(it.key)}
                          className="flex cursor-pointer items-center gap-3.25 border-t border-black/4 px-4.5 py-3 transition-colors hover:bg-cream-50"
                        >
                          <span
                            className={`flex h-5.5 w-5.5 flex-none items-center justify-center rounded-[7px] border-[1.5px] ${
                              isChecked ? "border-green-600 bg-green-600" : "border-ink-100 bg-white"
                            }`}
                          >
                            {isChecked && <CheckIcon size={13} className="text-white" />}
                          </span>
                          <span
                            className={`flex-1 font-body text-sm font-semibold ${
                              isChecked ? "text-ink-200 line-through" : "text-ink-800"
                            }`}
                          >
                            {it.name}
                          </span>
                          <span
                            className={`font-heading text-[13.5px] font-bold tabular-nums ${
                              isChecked ? "text-ink-100" : "text-ink-600"
                            }`}
                          >
                            {formatQty(it.qty, it.unit)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-black/12 px-5 py-17.5 text-center">
              <div className="mb-4 flex justify-center text-ink-50">
                <ShoppingBagIcon size={54} />
              </div>
              <h3 className="mb-2 text-[22px]">Lịch nấu ăn đang trống</h3>
              <p className="mx-auto mb-5.5 max-w-[420px] text-sm leading-relaxed text-ink-300">
                Thêm vài món vào lịch nấu ăn, TCook sẽ tự gom nguyên liệu thành danh sách đi chợ cho
                bạn.
              </p>
              <Link
                href="/meal-planner"
                className="inline-flex items-center gap-2.25 rounded-full bg-cream-300 px-6.5 py-3.5 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
              >
                Mở lịch nấu ăn
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* sidebar: recipes in plan */}
        <aside className="sticky top-4 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)]">
          <div className="border-b border-black/6 px-4.5 py-3.75">
            <h3 className="text-base">Món trong lịch</h3>
            <p className="mt-0.75 text-xs text-ink-300">Nguyên liệu được tính cho {servings} người.</p>
          </div>
          <div className="flex max-h-130 flex-col gap-1.5 overflow-y-auto p-2.5">
            {planRecipes.map((r) => (
              <div
                key={r.slug}
                className="flex items-center gap-2.75 rounded-[11px] border border-black/6 bg-cream-50 px-2.75 py-2.25"
              >
                <span
                  className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-[8px] font-heading text-[13px] font-bold text-white"
                  style={{ background: r.dot }}
                >
                  ×{r.count}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-body text-[12.5px] font-semibold text-ink-800">
                    {r.name}
                  </div>
                  <div className="text-[11px] text-ink-300">{r.category}</div>
                </div>
              </div>
            ))}
            {planRecipes.length === 0 && (
              <p className="px-2.5 py-4.5 text-center text-[12.5px] text-ink-200">Chưa có món nào.</p>
            )}
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
