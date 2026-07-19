"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { RECIPES } from "@/lib/data";
import { CloseIcon, HeartIcon, SearchIcon } from "@/components/icons";

const TRENDING = ["Tiramisu", "Phở bò", "Bánh mì", "Món chay", "Đồ uống"];

export function HeaderActions() {
  const { favoriteSlugs, removeFavorite } = useFavorites();
  const [favOpen, setFavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const favRecipes = favoriteSlugs
    .map((slug) => RECIPES.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (favOpen && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setFavOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [favOpen, searchOpen]);

  const q = query.trim().toLowerCase();
  const results = q
    ? RECIPES.filter((r) => (r.name + " " + r.category + " " + r.tags.join(" ")).toLowerCase().includes(q))
    : [];

  return (
    <div ref={rootRef} className="flex items-center gap-2.5 text-ink-600">
      <div className="relative">
        <button
          type="button"
          aria-label="Món đã lưu"
          onClick={(e) => {
            e.stopPropagation();
            setFavOpen((v) => !v);
          }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-black/6 bg-cream-100 text-ink-600 transition-colors hover:bg-cream-300 hover:text-ink-800"
        >
          <HeartIcon size={19} />
          {favRecipes.length > 0 && (
            <span className="pointer-events-none absolute -top-1.5 -right-1.5 z-10 flex h-[15px] min-w-[15px] items-center justify-center rounded-lg border-[1.5px] border-white bg-cream-300 px-1 text-[9px] font-bold leading-none text-[#5a4e3a]">
              {favRecipes.length}
            </span>
          )}
        </button>

        {favOpen && (
          <div className="absolute top-12 right-0 z-[60] w-80 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between border-b border-black/6 px-4 py-3.5">
              <span className="font-body text-sm font-bold text-ink-800">Món đã lưu</span>
              <span className="text-xs text-ink-300">{favRecipes.length} công thức</span>
            </div>
            {favRecipes.length > 0 ? (
              <>
                <div className="max-h-[300px] overflow-y-auto p-1.5">
                  {favRecipes.map((r) => (
                    <div
                      key={r.slug}
                      className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-cream-50"
                    >
                      <div className="h-[46px] w-[46px] flex-none rounded-lg bg-[repeating-linear-gradient(135deg,#efece7,#efece7_6px,#e7e3dc_6px,#e7e3dc_12px)]" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-ink-800">{r.name}</div>
                        <div className="text-[11.5px] text-ink-300">
                          {r.category} · ★ {r.rating} · {r.time}
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Bỏ lưu"
                        onClick={() => removeFavorite(r.slug)}
                        className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-ink-100 hover:bg-red-100 hover:text-red-600"
                      >
                        <CloseIcon size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Link
                  href="/favorites"
                  className="block border-t border-black/6 py-3 text-center font-body text-[12.5px] font-semibold text-ink-800"
                >
                  Xem tất cả món đã lưu
                </Link>
              </>
            ) : (
              <div className="px-5 py-[30px] text-center">
                <div className="mb-2 flex justify-center text-ink-50">
                  <HeartIcon size={34} />
                </div>
                <p className="text-[13px] text-ink-300">
                  Chưa có món nào được lưu.
                  <br />
                  Nhấn ♥ trên công thức để lưu lại!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="Tìm kiếm"
        onClick={() => setSearchOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/6 bg-cream-100 text-ink-600 transition-colors hover:bg-cream-300 hover:text-ink-800"
      >
        <SearchIcon size={19} />
      </button>

      {searchOpen && (
        <div
          onClick={() => {
            setSearchOpen(false);
            setQuery("");
          }}
          className="fixed inset-0 z-[200] flex justify-center bg-[#1c1a16]/55 px-5 pt-[14vh] pb-5 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-max max-h-[72vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center gap-3 border-b border-black/6 px-[22px] py-[18px]">
              <SearchIcon size={20} className="text-ink-100" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Tìm công thức, nguyên liệu, món ăn..."
                className="flex-1 border-none bg-transparent font-body text-base font-medium text-ink-800 outline-none"
              />
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-lg bg-cream-100 hover:bg-cream-300"
              >
                <CloseIcon size={15} />
              </button>
            </div>
            <div className="overflow-y-auto p-2">
              {q.length === 0 && (
                <>
                  <div className="px-3.5 pt-3.5 pb-1.5">
                    <span className="font-body text-[11px] font-semibold tracking-[0.08em] text-ink-100 uppercase">
                      Tìm nhiều nhất
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3.5 pb-3.5 pt-1">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="rounded-full border border-black/6 bg-cream-100 px-3.5 py-2 font-body text-[12.5px] font-medium text-ink-600 hover:bg-cream-300 hover:text-ink-800"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {q.length > 0 && results.length > 0 && (
                <>
                  <div className="px-3.5 pt-2.5 pb-1">
                    <span className="font-body text-[11px] font-semibold tracking-[0.08em] text-ink-100 uppercase">
                      {results.length} kết quả
                    </span>
                  </div>
                  {results.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/recipes/${r.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-cream-50"
                    >
                      <div className="h-[54px] w-[54px] flex-none rounded-xl bg-[repeating-linear-gradient(135deg,#efece7,#efece7_6px,#e7e3dc_6px,#e7e3dc_12px)]" />
                      <div className="min-w-0 flex-1">
                        <div className="font-body text-sm font-semibold text-ink-800">{r.name}</div>
                        <div className="mt-0.5 text-xs text-ink-300">
                          {r.category} · ★ {r.rating} · {r.time}
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
              {q.length > 0 && results.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <div className="mb-2.5 flex justify-center text-ink-50">
                    <SearchIcon size={38} />
                  </div>
                  <p className="text-sm text-ink-300">
                    Không tìm thấy kết quả cho &ldquo;
                    <span className="font-semibold text-ink-800">{query}</span>&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
