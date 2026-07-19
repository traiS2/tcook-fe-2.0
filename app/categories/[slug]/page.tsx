"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { getCategoryBySlug } from "@/lib/data";
import { difficultyMeta, slugify } from "@/lib/format";
import {
  CATEGORY_ICONS,
  CalendarIcon,
  ChefHatIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  GridIcon,
  HeartIcon,
  SoupIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
} from "@/components/icons";

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug);
  const [selectedSub, setSelectedSub] = useState<string>("all");

  useEffect(() => {
    // Deliberate: App Router reuses this component across sibling [slug]
    // navigations, so reset the sub-category filter whenever the slug changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedSub("all");
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen w-full bg-white">
        <SiteHeader activeNav="categories" />
        <div className="page-px flex flex-col items-center gap-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Không tìm thấy danh mục</h1>
          <p className="max-w-[420px] text-sm leading-relaxed text-ink-500">
            Danh mục bạn tìm không tồn tại hoặc đã bị gỡ bỏ. Hãy quay lại trang danh mục để khám phá thêm.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full bg-cream-300 px-6 py-3 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
          >
            Về trang Danh mục
          </Link>
        </div>
        <SiteFooter active="Danh mục" />
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[category.icon];
  const subCards = category.subs.map((name) => ({
    name,
    count: category.recipes.filter((r) => r.sub === name).length,
  }));
  const recipes = category.recipes.filter((r) => selectedSub === "all" || r.sub === selectedSub);
  const hasRecipes = recipes.length > 0;
  const recipeCountLabel = hasRecipes ? `${recipes.length} công thức` : "Chưa có công thức";

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeNav="categories" />

      {/* breadcrumb */}
      <Reveal className="page-px flex items-center gap-2 pt-4.5 text-[13px] text-ink-300">
        <Link href="/" className="text-ink-300">
          Trang chủ
        </Link>
        <span className="text-ink-50">/</span>
        <Link href="/categories" className="text-ink-300">
          Danh mục
        </Link>
        <span className="text-ink-50">/</span>
        <span className="font-semibold text-ink-800">{category.name}</span>
      </Reveal>

      {/* category hero */}
      <Reveal className="page-px pb-2 pt-5.5">
        <div className="flex flex-wrap items-center gap-6.5 rounded-3xl border border-black/6 bg-gradient-to-br from-cream-50 to-cream-200 p-8.5">
          <span className="flex h-19.5 w-19.5 flex-none items-center justify-center rounded-[20px] bg-cream-300 text-ink-800 shadow-[0_10px_26px_rgba(0,0,0,0.06)]">
            <Icon size={38} />
          </span>
          <div className="min-w-60 flex-1">
            {category.count > 0 && (
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg border border-gold-300 bg-gold-100 px-2.5 py-1 font-body text-[11.5px] font-bold text-gold-700">
                <StarIcon size={11} />
                Nổi bật
              </span>
            )}
            <h1 className="text-[42px] font-bold leading-[1.05] max-sm:text-3xl">{category.name}</h1>
            <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-ink-500">{category.description}</p>
          </div>
          <div className="flex flex-none gap-3.5">
            <div className="min-w-26 rounded-2xl border border-black/7 bg-white p-4 px-5.5 text-center">
              <div className="font-heading text-[30px] font-bold text-ink-800">{category.subs.length}</div>
              <div className="mt-0.5 text-[11.5px] text-ink-300">Chuyên mục</div>
            </div>
            <div className="min-w-26 rounded-2xl border border-black/7 bg-white p-4 px-5.5 text-center">
              <div className="font-heading text-[30px] font-bold text-gold-700">{category.count}</div>
              <div className="mt-0.5 text-[11.5px] text-ink-300">Công thức</div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* chuyên mục cards */}
      <Reveal className="page-px pt-7.5">
        <h2 className="text-2xl font-bold">Chuyên mục</h2>
        <p className="mt-0.5 text-[13px] text-ink-300">Chọn một chuyên mục để lọc công thức bên dưới</p>
        <div className="mt-4.5 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3.5">
          <SubCard
            active={selectedSub === "all"}
            label="Tất cả"
            count={category.count}
            icon={<GridIcon size={20} />}
            onClick={() => setSelectedSub("all")}
          />
          {subCards.map((s) => (
            <SubCard
              key={s.name}
              active={selectedSub === s.name}
              label={s.name}
              count={s.count}
              icon={<TagIcon size={20} />}
              onClick={() => setSelectedSub(s.name)}
            />
          ))}
        </div>
      </Reveal>

      {/* công thức cards */}
      <Reveal delay="80ms" className="page-px pb-14 pt-8.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="whitespace-nowrap text-2xl font-bold">Công thức</h2>
          <span className="text-[13px] text-ink-300">{recipeCountLabel}</span>
        </div>

        {hasRecipes ? (
          <div className="mt-5 grid grid-cols-2 gap-5.5 max-lg:grid-cols-1">
            {recipes.map((r) => {
              const dm = difficultyMeta(r.difficulty);
              return (
                <Link
                  key={r.name}
                  href={`/recipes/${slugify(r.name)}`}
                  className="flex flex-col overflow-hidden rounded-[18px] border border-black/7 bg-white shadow-[0_6px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]"
                >
                  <div className="relative">
                    <Placeholder label={r.imageLabel} className="h-50" />
                    <span className="absolute left-3 top-3 rounded-lg bg-white px-2.5 py-1.5 font-body text-[11.5px] font-semibold text-ink-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      {r.sub}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-body text-[11.5px] font-bold text-gold-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      <StarIcon size={12} />
                      {r.rating}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4.5 pb-5.5">
                    <div className="mb-2.5 flex items-center justify-between text-[11.5px] text-ink-300">
                      <span className="flex items-center gap-1.5">
                        <ChefHatIcon size={13} />
                        {r.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon size={13} />
                        {r.date}
                      </span>
                    </div>
                    <h3 className="text-[21px] font-bold">{r.name}</h3>
                    <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-ink-500">{r.description}</p>
                    <div className="mt-3.5 grid grid-cols-4 gap-1.5">
                      <StatBox icon={<ClockIcon size={14} />} label="Thời gian" value={r.time} />
                      <StatBox icon={<UsersIcon size={14} />} label="Khẩu phần" value={r.serve} />
                      <StatBox
                        icon={
                          <span
                            className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: dm.color }}
                          >
                            {dm.num}
                          </span>
                        }
                        label="Độ khó"
                        value={r.difficulty}
                      />
                      <StatBox icon={<StarIcon size={14} className="text-gold-700" />} label="Đánh giá" value={r.rating} />
                    </div>
                    <div className="mt-3.5 flex items-center justify-between border-t border-black/6 pt-3">
                      <div className="flex gap-1.5">
                        <span className="rounded-md bg-cream-200 px-2.5 py-1 font-body text-[11px] font-medium text-ink-600">
                          {r.tagMain}
                        </span>
                        <span className="rounded-md bg-cream-200 px-2.5 py-1 font-body text-[11px] font-medium text-ink-600">
                          {r.tagMore}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11.5px] text-ink-300">
                        <span className="flex items-center gap-1">
                          <EyeIcon size={14} />
                          {r.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon size={14} />
                          {r.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-[20px] border border-dashed border-black/12 bg-cream-50 px-5 py-16 text-center">
            <div className="mb-3.5 flex justify-center text-ink-100">
              <SoupIcon size={46} className="stroke-[1.5]" />
            </div>
            <h3 className="mb-2 text-[19px]">Chưa có công thức</h3>
            <p className="mx-auto max-w-[360px] text-sm leading-relaxed text-ink-300">
              Chuyên mục này đang được cập nhật. Hãy quay lại sau để khám phá công thức mới nhé!
            </p>
            <Link
              href="/recipes"
              className="mt-5 inline-flex items-center gap-1.5 rounded-[11px] bg-cream-300 px-5.5 py-3 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
            >
              Xem tất cả công thức
              <ChevronRightIcon size={15} />
            </Link>
          </div>
        )}
      </Reveal>

      <SiteFooter active="Danh mục" />
    </div>
  );
}

function SubCard({
  active,
  label,
  count,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)] ${
        active ? "border-gold-300 bg-[#f6f0e6]" : "border-black/8 bg-white"
      }`}
    >
      <span
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
          active ? "bg-[#ece0c4] text-[#9a6d10]" : "bg-cream-100 text-ink-600"
        }`}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div
          className={`line-clamp-2 font-body text-[14.5px] font-semibold leading-tight ${
            active ? "text-[#7a5709]" : "text-ink-800"
          }`}
        >
          {label}
        </div>
        <div className="whitespace-nowrap text-[11.5px] text-ink-300">{count} công thức</div>
      </div>
    </button>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[11px] bg-cream-100 px-1.5 py-2.5 text-center">
      <div className="mb-1 flex justify-center text-ink-300">{icon}</div>
      <div className="text-[9.5px] text-ink-300">{label}</div>
      <div className="font-heading text-xs font-bold text-ink-900">{value}</div>
    </div>
  );
}
