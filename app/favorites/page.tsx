"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { useFavorites } from "@/hooks/useFavorites";
import { getRecipeBySlug, type Recipe } from "@/lib/data";
import { difficultyMeta } from "@/lib/format";
import { ArrowRightIcon, ClockIcon, HeartIcon, StarIcon, TrashIcon, UsersIcon } from "@/components/icons";

export default function FavoritesPage() {
  const { favoriteSlugs, removeFavorite, clearFavorites } = useFavorites();
  const favorites = favoriteSlugs
    .map((slug) => getRecipeBySlug(slug))
    .filter((r): r is Recipe => Boolean(r));
  const hasFavs = favorites.length > 0;

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeUtility="favorites" />

      {/* hero */}
      <div className="border-t border-black/5 bg-gradient-to-b from-cream-50 to-white">
        <Reveal className="page-px pb-7.5 pt-9">
          <div className="mb-4.5 flex items-center gap-2 text-[12.5px] text-ink-300">
            <Link href="/" className="text-ink-300">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink-600">Món đã lưu</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-script text-2xl text-ink-700">Bộ sưu tập của bạn</span>
              <h1 className="mt-0.5 flex items-center gap-3.5 text-[44px] font-bold leading-[1.08] max-sm:text-3xl">
                Món Đã Lưu
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-300 px-4 py-1.5 font-heading text-base font-bold text-ink-800">
                  <HeartIcon size={16} fill="currentColor" />
                  {favorites.length}
                </span>
              </h1>
              <p className="mt-3 max-w-[520px] text-[14.5px] leading-relaxed text-ink-500">
                Tất cả công thức bạn đã nhấn tim, gom về một nơi. Nhấn lại vào tim để bỏ lưu bất cứ lúc
                nào.
              </p>
            </div>
            {hasFavs && (
              <button
                type="button"
                onClick={clearFavorites}
                className="inline-flex items-center gap-2 rounded-full border border-black/14 bg-white px-5 py-2.75 font-body text-[13px] font-semibold text-ink-600 transition-transform hover:-translate-y-0.5"
              >
                <TrashIcon size={15} />
                Xóa tất cả
              </button>
            )}
          </div>
        </Reveal>
      </div>

      {/* grid / empty */}
      <div className="page-px pb-15 pt-8.5">
        {hasFavs ? (
          <Reveal className="grid grid-cols-3 gap-5.5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {favorites.map((r) => (
              <FavoriteCard key={r.slug} recipe={r} onRemove={() => removeFavorite(r.slug)} />
            ))}
          </Reveal>
        ) : (
          <Reveal className="rounded-[22px] border border-dashed border-black/12 px-5 py-20 text-center">
            <div className="mb-4.5 flex justify-center text-ink-50">
              <HeartIcon size={60} className="stroke-[1.4]" />
            </div>
            <h3 className="mb-2 text-2xl">Chưa có món nào được lưu</h3>
            <p className="mx-auto mb-5.5 max-w-[420px] text-sm leading-relaxed text-ink-300">
              Duyệt qua các công thức và nhấn vào biểu tượng tim để lưu những món bạn muốn nấu sau.
            </p>
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2.5 rounded-full bg-cream-300 px-6.5 py-3.5 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
            >
              Khám phá công thức
              <ArrowRightIcon size={16} />
            </Link>
          </Reveal>
        )}
      </div>

      <SiteFooter active="Món đã lưu" />
    </div>
  );
}

function FavoriteCard({ recipe: r, onRemove }: { recipe: Recipe; onRemove: () => void }) {
  const diff = difficultyMeta(r.difficulty);
  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-black/7 bg-white shadow-[0_6px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]">
      <div className="relative overflow-hidden">
        <Placeholder label={r.imageLabel} style={{ height: 180 }} />
        <span className="absolute left-3 top-3 rounded-lg bg-white px-2.75 py-1.25 font-body text-[11.5px] font-semibold text-ink-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          {r.category}
        </span>
        <span className="absolute right-13 top-3 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.25 font-body text-[11.5px] font-bold text-gold-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <StarIcon size={12} />
          {r.rating}
        </span>
        <button
          type="button"
          aria-label="Bỏ lưu"
          title="Bỏ lưu"
          onClick={onRemove}
          className="absolute right-2.75 top-2.75 flex h-8 w-8 items-center justify-center rounded-[9px] bg-white text-red-600 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.08] active:scale-[0.86]"
        >
          <HeartIcon size={16} fill="currentColor" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4.5 pt-4">
        <h3 className="text-xl font-bold">{r.name}</h3>
        <p className="mt-1.75 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">{r.description}</p>
        <div className="mt-3.5 grid grid-cols-3 gap-1.75">
          <div className="rounded-[11px] bg-cream-100 px-1.5 py-2.5 text-center">
            <div className="mb-0.75 flex justify-center text-ink-300">
              <ClockIcon size={14} />
            </div>
            <div className="text-[9.5px] text-ink-300">Thời gian</div>
            <div className="font-heading text-xs font-bold">{r.time}</div>
          </div>
          <div className="rounded-[11px] bg-cream-100 px-1.5 py-2.5 text-center">
            <div className="mb-0.75 flex justify-center text-ink-300">
              <UsersIcon size={14} />
            </div>
            <div className="text-[9.5px] text-ink-300">Khẩu phần</div>
            <div className="font-heading text-xs font-bold">{r.serve}</div>
          </div>
          <div className="rounded-[11px] bg-cream-100 px-1.5 py-2.5 text-center">
            <div className="mb-0.75 flex justify-center">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full font-heading text-[10px] font-bold text-white"
                style={{ background: diff.color }}
              >
                {diff.num}
              </span>
            </div>
            <div className="text-[9.5px] text-ink-300">Độ khó</div>
            <div className="font-heading text-xs font-bold">{r.difficulty}</div>
          </div>
        </div>
        <Link
          href={`/recipes/${r.slug}`}
          className="mt-3.5 flex items-center justify-center gap-2 rounded-[10px] bg-cream-300 py-2.75 font-body text-[13px] font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
        >
          Xem công thức
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </div>
  );
}
