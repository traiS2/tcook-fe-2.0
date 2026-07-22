"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { CATEGORIES, type Category } from "@/lib/data";
import {
  ArrowRightIcon,
  BarsIcon,
  CATEGORY_ICONS,
  ChevronRightIcon,
  CloseIcon,
  SearchIcon,
  StarIcon,
  TagIcon,
  TrendUpIcon,
} from "@/components/icons";

const SORT_OPTIONS = ["Phổ biến", "Mới nhất", "Nhiều công thức", "A–Z"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const STAT_TARGETS = { groups: CATEGORIES.length, recipes: 7, chefs: 89 };

export default function CategoriesPage() {
  const [catQuery, setCatQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Phổ biến");
  const [spotIdx, setSpotIdx] = useState(0);
  const [counts, setCounts] = useState({ groups: 0, recipes: 0, chefs: 0 });

  // auto-advance the spotlight carousel
  useEffect(() => {
    const id = setInterval(() => {
      setSpotIdx((i) => (i + 1) % CATEGORIES.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  // ease-out-cubic count-up on mount
  useEffect(() => {
    const duration = 1150;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setCounts({
        groups: Math.round(STAT_TARGETS.groups * eased),
        recipes: Math.round(STAT_TARGETS.recipes * eased),
        chefs: Math.round(STAT_TARGETS.chefs * eased),
      });
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const q = catQuery.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const cats = useMemo(() => {
    let list = CATEGORIES.slice();
    if (q) {
      list = list.filter((c) =>
        `${c.name} ${c.description} ${c.subs.join(" ")}`.toLowerCase().includes(q)
      );
    }
    if (sort === "Phổ biến" || sort === "Nhiều công thức") {
      list = [...list].sort((a, b) => b.count - a.count);
    } else if (sort === "A–Z") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sort === "Mới nhất") {
      list = [...list].reverse();
    }
    return list;
  }, [q, sort]);

  const noMatch = hasQuery && cats.length === 0;

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeNav="categories" />

      {/* hero */}
      <Reveal className="grid grid-cols-[1.1fr_0.9fr] items-center gap-9 bg-gradient-to-b from-cream-50 to-white page-px pt-9 pb-8.5 max-lg:grid-cols-1">
        <div>
          <span className="font-script text-[26px] text-ink-700">Khám phá theo nhóm món</span>
          <h1 className="mt-0.5 text-[50px] font-bold leading-[1.04] max-sm:text-4xl">
            Danh Mục
            <br />
            Công Thức
          </h1>
          <p className="mt-3.5 max-w-[440px] text-[15px] leading-relaxed text-ink-500">
            Chọn một nhóm món để bắt đầu hành trình nấu nướng — thư viện công thức đang lớn dần mỗi
            tuần.
          </p>
          <div className="mt-5.5 flex max-w-105 items-center gap-2.75 rounded-[14px] border border-black/10 bg-white px-4 py-2.75 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <SearchIcon size={18} className="flex-none text-ink-300" />
            <input
              value={catQuery}
              onChange={(e) => setCatQuery(e.target.value)}
              placeholder="Tìm danh mục..."
              className="flex-1 border-none bg-transparent font-body text-sm text-ink-800 outline-none placeholder:text-ink-200"
            />
            {hasQuery && (
              <button
                type="button"
                aria-label="Xóa"
                onClick={() => setCatQuery("")}
                className="flex h-5.5 w-5.5 flex-none items-center justify-center rounded-md border-none bg-cream-200 text-ink-300"
              >
                <CloseIcon size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SpotlightCard index={spotIdx} onDot={setSpotIdx} />

          <div className="flex items-stretch overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.05)]">
            <StatBox value={counts.groups} label="Nhóm danh mục" color="text-ink-800" />
            <span className="w-px bg-black/7" />
            <StatBox value={counts.recipes} label="Công thức" color="text-gold-700" />
            <span className="w-px bg-black/7" />
            <StatBox value={counts.chefs} label="Đầu bếp" color="text-ink-900" />
          </div>
        </div>
      </Reveal>

      {/* sort bar */}
      <Reveal className="flex flex-wrap items-center justify-between gap-3 page-px pt-6.5">
        <div>
          <h2 className="flex items-center gap-2 text-[28px] font-bold">
            <BarsIcon size={22} className="text-ink-300" />
            Tất Cả Danh Mục
          </h2>
          <span className="text-[13px] text-ink-300">{cats.length} nhóm món</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] text-ink-300">Sắp xếp:</span>
          {SORT_OPTIONS.map((s) => (
            <span
              key={s}
              onClick={() => setSort(s)}
              className={`cursor-pointer rounded-full border px-3.75 py-1.75 font-body text-[13px] font-medium transition-colors ${
                sort === s
                  ? "border-transparent bg-cream-300 text-ink-800"
                  : "border-black/12 bg-white text-ink-600 hover:border-black/25 hover:bg-cream-50"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>

      {/* grid */}
      <Reveal delay="80ms" className="grid grid-cols-3 items-start gap-5.5 page-px pt-5.5 pb-13 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {cats.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
        {noMatch && (
          <div className="col-span-full py-14 px-5 text-center">
            <div className="mb-2.5 flex justify-center text-ink-50">
              <SearchIcon size={40} className="opacity-70" />
            </div>
            <p className="text-[14.5px] text-ink-300">
              Không tìm thấy danh mục cho &ldquo;
              <span className="font-semibold text-ink-800">{catQuery}</span>&rdquo;
            </p>
          </div>
        )}
      </Reveal>

      <SiteFooter active="Danh mục" />
    </div>
  );
}

function StatBox({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex-1 px-3 py-3.75 text-center">
      <div className={`font-heading text-[28px] font-bold ${color}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-300">{label}</div>
    </div>
  );
}

function SpotlightCard({
  index,
  onDot,
}: {
  index: number;
  onDot: (i: number) => void;
}) {
  return (
    <div className="relative h-65.5">
      <div className="absolute left-3.5 right-3.5 top-4 -bottom-1 rounded-[20px] bg-[#efece6] opacity-55" />
      <div className="absolute left-1.75 right-1.75 top-2 bottom-0 rounded-[20px] bg-[#f6f3ee] opacity-85 shadow-[0_8px_20px_rgba(0,0,0,0.04)]" />
      <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-black/7 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.09)]">
        <div
          className="absolute inset-0 flex will-change-transform"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 0.8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {CATEGORIES.map((c) => (
            <SpotlightSlide key={c.slug} category={c} onGoTo={onDot} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpotlightSlide({
  category,
  onGoTo,
}: {
  category: Category;
  onGoTo: (i: number) => void;
}) {
  const Icon = CATEGORY_ICONS[category.icon];
  return (
    <div className="box-border flex w-full flex-none flex-col px-6 py-5.5">
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.11em] text-[#b0a99d]">
          Nhóm nổi bật
        </span>
        <div className="flex gap-1.25">
          {CATEGORIES.map((c, i) => (
            <span
              key={c.slug}
              onClick={() => onGoTo(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                c.slug === category.slug ? "w-4 bg-ink-800" : "w-1.5 bg-cream-400"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex h-14.5 w-14.5 items-center justify-center rounded-2xl bg-cream-300 text-ink-800">
        <Icon size={28} />
      </div>
      <h3 className="mt-4 mb-1.5 text-2xl font-bold text-ink-900">{category.name}</h3>
      <p className="m-0 flex-1 text-[13px] leading-relaxed text-ink-500">{category.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-3.5">
        <span className="text-[12.5px] text-ink-600">
          {category.count > 0 ? `${category.count} công thức có sẵn` : "Sắp cập nhật"}
        </span>
        <span className="flex cursor-pointer items-center gap-1.5 text-[12.5px] font-semibold text-ink-900">
          Khám phá
          <ArrowRightIcon size={14} />
        </span>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category.icon];
  const featured = category.count > 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[18px] border border-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/12 ${
        featured
          ? "shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]"
          : "shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]"
      }`}
    >
      {featured && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold-700" />}
      <div className="flex items-center justify-between">
        <span
          className={`flex h-13 w-13 items-center justify-center rounded-[14px] transition-colors duration-300 group-hover:bg-cream-300 group-hover:text-ink-800 ${
            featured ? "bg-cream-300 text-ink-800" : "bg-cream-100 text-ink-900"
          }`}
        >
          <Icon size={24} />
        </span>
        {featured ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300 bg-gold-100 px-2.5 py-1 font-body text-[11.5px] font-bold text-gold-700">
            <StarIcon size={11} />
            Nổi bật
          </span>
        ) : (
          <span className="rounded-lg bg-cream-200 px-2.5 py-1 font-body text-[11.5px] font-semibold text-ink-300">
            Sắp có
          </span>
        )}
      </div>
      <h3 className="mt-4 mb-1.5 text-[21px]">{category.name}</h3>
      <p className="line-clamp-2 min-h-10 text-[12.5px] leading-relaxed text-ink-500">
        {category.description}
      </p>
      <div className="mt-4.5 flex items-center justify-between gap-3 border-t border-black/6 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.75 whitespace-nowrap font-body text-xs font-medium text-ink-600">
            <TagIcon size={14} />
            {category.subs.length} chuyên mục
          </span>
          <span
            className={`inline-flex items-center gap-1.75 whitespace-nowrap font-body text-xs font-medium ${
              featured ? "text-ink-600" : "text-ink-200"
            }`}
          >
            <TrendUpIcon size={14} />
            {category.count > 0 ? `${category.count} công thức` : "Đang cập nhật"}
          </span>
        </div>
        <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-full bg-cream-200 text-ink-800">
          <ChevronRightIcon size={14} />
        </span>
      </div>
    </Link>
  );
}
