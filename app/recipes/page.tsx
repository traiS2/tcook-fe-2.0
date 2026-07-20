"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { useFavorites } from "@/hooks/useFavorites";
import { FEATURED_RECIPE_SLUG, RECIPES, RECIPE_CATEGORIES, getRecipeBySlug, type Recipe } from "@/lib/data";
import { difficultyMeta, parseMinutes } from "@/lib/format";
import {
  ArrowRightIcon,
  BagIcon,
  BarsIcon,
  CalendarIcon,
  CheckIcon,
  ChefHatIcon,
  ClockIcon,
  CommentIcon,
  EyeIcon,
  HeartIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from "@/components/icons";

const CATEGORY_OPTIONS: string[] = ["Tất cả", ...RECIPE_CATEGORIES];
const DIFFICULTY_OPTIONS: { value: string; label: string }[] = [
  { value: "Tất cả", label: "Tất cả" },
  { value: "Dễ", label: "Dễ" },
  { value: "Trung bình", label: "TB" },
  { value: "Khó", label: "Khó" },
];
const TIME_OPTIONS = ["Tất cả", "< 30 phút", "30–60 phút", "> 1 giờ"];
const RATING_OPTIONS = ["Tất cả", "4.5★+", "4.7★+", "4.9★+"];
const INGREDIENT_OPTIONS = ["Thịt gà", "Thịt bò", "Thịt heo", "Trứng", "Rau củ", "Cà phê", "Trà", "Sữa"];

function DownChevronIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function RecipesPage() {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [difficulty, setDifficulty] = useState("Tất cả");
  const [timeFilter, setTimeFilter] = useState("Tất cả");
  const [ratingFilter, setRatingFilter] = useState("Tất cả");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const featured = getRecipeBySlug(FEATURED_RECIPE_SLUG)!;
  const featFav = isFavorite(featured.slug);
  const featDiff = difficultyMeta(featured.difficulty);

  // Exclude the featured recipe from the filterable pool so it isn't shown twice.
  const pool = useMemo(() => RECIPES.filter((r) => r.slug !== FEATURED_RECIPE_SLUG), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORY_OPTIONS.forEach((c) => {
      counts[c] = c === "Tất cả" ? pool.length : pool.filter((r) => r.category === c).length;
    });
    return counts;
  }, [pool]);

  const ingredientCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    INGREDIENT_OPTIONS.forEach((i) => {
      counts[i] = pool.filter((r) => r.ingredients.includes(i)).length;
    });
    return counts;
  }, [pool]);

  const minRating = ratingFilter === "4.5★+" ? 4.5 : ratingFilter === "4.7★+" ? 4.7 : ratingFilter === "4.9★+" ? 4.9 : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool.filter((r) => {
      if (category !== "Tất cả" && r.category !== category) return false;
      if (difficulty !== "Tất cả" && r.difficulty !== difficulty) return false;
      const minutes = parseMinutes(r.time);
      if (timeFilter === "< 30 phút" && !(minutes < 30)) return false;
      if (timeFilter === "30–60 phút" && !(minutes >= 30 && minutes <= 60)) return false;
      if (timeFilter === "> 1 giờ" && !(minutes > 60)) return false;
      if (parseFloat(r.rating) < minRating) return false;
      if (ingredients.length && !ingredients.some((i) => r.ingredients.includes(i))) return false;
      if (q) {
        const hay = `${r.name} ${r.tags.join(" ")} ${r.ingredients.join(" ")} ${r.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [pool, category, difficulty, timeFilter, minRating, ingredients, query]);

  const activeFilterCount =
    (category !== "Tất cả" ? 1 : 0) +
    (difficulty !== "Tất cả" ? 1 : 0) +
    (timeFilter !== "Tất cả" ? 1 : 0) +
    (ratingFilter !== "Tất cả" ? 1 : 0) +
    (ingredients.length ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setQuery("");
    setCategory("Tất cả");
    setDifficulty("Tất cả");
    setTimeFilter("Tất cả");
    setRatingFilter("Tất cả");
    setIngredients([]);
  };

  const toggleIngredient = (name: string) => {
    setIngredients((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const catSuffix = category === "Tất cả" ? "" : ` · ${category}`;

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeNav="recipes" />

      {/* featured */}
      <Reveal className="page-px pt-7.5">
        <div className="mb-3.5 flex items-center gap-2">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-ink-300">
            Công thức của tuần
          </span>
          <span className="h-px flex-1 bg-black/8" />
        </div>
        <Link
          href={`/recipes/${featured.slug}`}
          className="grid grid-cols-[1.12fr_1fr] overflow-hidden rounded-[18px] border border-black/7 bg-white shadow-[0_6px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)] max-lg:grid-cols-1"
        >
          <Placeholder label={featured.imageLabel} className="min-h-85" />
          <div className="flex flex-col justify-center p-8 max-lg:p-6.5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-cream-200 px-3.5 py-1.5 font-body text-xs font-semibold text-ink-600">
                {featured.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-gold-300 bg-gold-100 px-3 py-1.5 font-body text-xs font-bold text-gold-700">
                <StarIcon size={12} />
                Nổi bật
              </span>
            </div>
            <div className="mb-2.5 flex items-center justify-between text-[12.5px] text-ink-300">
              <span className="flex items-center gap-1.5">
                <ChefHatIcon size={14} />
                {featured.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarIcon size={14} />
                {featured.date}
              </span>
            </div>
            <h1 className="text-[34px] font-bold leading-[1.12]">{featured.name}</h1>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-500">{featured.description}</p>
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              <StatBox label="Thời gian" value="4g 55p" icon={<ClockIcon size={16} />} />
              <StatBox label="Khẩu phần" value={featured.serve} icon={<UserIcon size={16} />} />
              <StatBox
                label="Độ khó"
                value={featured.difficulty}
                badge={
                  <span
                    className="flex h-4.5 w-4.5 items-center justify-center rounded-full font-heading text-[11px] font-bold text-white"
                    style={{ background: featDiff.color }}
                  >
                    {featDiff.num}
                  </span>
                }
              />
              <StatBox label="Đánh giá" value={featured.rating} icon={<StarIcon size={16} className="text-gold-700" />} />
            </div>
            <div className="mt-4.5 flex items-center justify-between border-t border-black/7 pt-4">
              <div className="flex gap-2">
                <span className="rounded-md bg-cream-200 px-2.5 py-1 font-body text-[11.5px] font-medium text-ink-600">
                  #{featured.tags[0]}
                </span>
                {featured.tags.length > 1 && (
                  <span className="rounded-md bg-cream-200 px-2.5 py-1 font-body text-[11.5px] font-medium text-ink-600">
                    +{featured.tags.length - 1}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3.5 text-[12.5px] text-ink-300">
                <span className="flex items-center gap-1.5">
                  <EyeIcon size={15} />
                  {featured.views}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(featured.slug);
                  }}
                  className={`flex items-center gap-1.5 transition-transform active:scale-90 ${featFav ? "text-red-600" : ""}`}
                >
                  <HeartIcon size={15} fill={featFav ? "currentColor" : "none"} />
                  <span>{featured.likes + (featFav ? 1 : 0)}</span>
                </button>
                <span className="flex items-center gap-1.5">
                  <CommentIcon size={15} />0
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* filter + grid */}
      <div className="grid grid-cols-[260px_1fr] items-start gap-7 page-px pb-14 pt-9 max-lg:grid-cols-1">
        {/* sidebar */}
        <Reveal className="sticky top-4 flex flex-col gap-4 max-lg:static">
          <div className="flex items-center gap-2.5 rounded-2xl border border-black/10 bg-white p-3.5">
            <SearchIcon size={17} className="text-ink-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm công thức, nguyên liệu..."
              className="min-w-0 flex-1 border-none bg-transparent font-body text-[13px] font-medium text-ink-800 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-black/7 p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="text-sm">Danh mục</h4>
              <BarsIcon size={15} className="text-ink-200" />
            </div>
            <div className="flex flex-col gap-0.5">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="flex items-center justify-between rounded-[10px] px-2.5 py-2 text-left text-[13px] text-ink-600 transition-colors hover:bg-cream-100"
                >
                  <span className="flex items-center gap-2.5">
                    {category === c ? (
                      <span className="flex h-4.5 w-4.5 flex-none items-center justify-center rounded-md bg-cream-300">
                        <CheckIcon size={11} className="text-ink-800" />
                      </span>
                    ) : (
                      <span className="h-4.5 w-4.5 flex-none rounded-md border-[1.5px] border-ink-100" />
                    )}
                    <span>{c}</span>
                  </span>
                  <span className="text-ink-200">{categoryCounts[c]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/7 p-4">
            <h4 className="mb-3 text-sm">Độ khó</h4>
            <div className="flex flex-wrap gap-1.75">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`rounded-full px-3.25 py-1.5 font-body text-xs font-medium transition-colors ${
                    difficulty === d.value ? "bg-cream-300 text-ink-800" : "bg-cream-200 text-ink-600 hover:bg-cream-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/7 p-4">
            <h4 className="mb-3 text-sm">Thời gian nấu</h4>
            <div className="flex flex-wrap gap-1.75">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeFilter(t)}
                  className={`rounded-full px-3.25 py-1.5 font-body text-xs font-medium transition-colors ${
                    timeFilter === t ? "bg-cream-300 text-ink-800" : "bg-cream-200 text-ink-600 hover:bg-cream-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/7 p-4">
            <h4 className="mb-3 text-sm">Đánh giá</h4>
            <div className="flex flex-wrap gap-1.75">
              {RATING_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRatingFilter(t)}
                  className={`rounded-full px-3.25 py-1.5 font-body text-xs font-medium transition-colors ${
                    ratingFilter === t ? "bg-cream-300 text-ink-800" : "bg-cream-200 text-ink-600 hover:bg-cream-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/7 p-4">
            <div className="mb-2.5 flex items-center justify-between">
              <h4 className="text-sm">Nguyên liệu sẵn có</h4>
              <BagIcon size={15} className="text-ink-200" />
            </div>
            <div className="flex flex-col gap-0.5">
              {INGREDIENT_OPTIONS.map((i) => {
                const on = ingredients.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleIngredient(i)}
                    className="flex items-center justify-between rounded-[10px] px-2.5 py-2 text-left text-[13px] text-ink-600 transition-colors hover:bg-cream-100"
                  >
                    <span className="flex items-center gap-2.5">
                      {on ? (
                        <span className="flex h-4.5 w-4.5 flex-none items-center justify-center rounded-md bg-cream-300">
                          <CheckIcon size={11} className="text-ink-800" />
                        </span>
                      ) : (
                        <span className="h-4.5 w-4.5 flex-none rounded-md border-[1.5px] border-ink-100" />
                      )}
                      <span>{i}</span>
                    </span>
                    <span className="text-ink-200">{ingredientCounts[i]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl py-1.5 text-center font-body text-[13px] font-semibold text-ink-300 transition-transform hover:-translate-y-0.5 hover:text-ink-600"
          >
            Xóa bộ lọc{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
          </button>
        </Reveal>

        {/* grid */}
        <div>
          <Reveal className="mb-5 flex items-center justify-between">
            <span className="text-[13.5px] text-ink-300">
              <b className="font-heading text-ink-900">{filtered.length}</b> công thức{catSuffix}
            </span>
            <span className="inline-flex items-center gap-1.75 rounded-[10px] border border-black/10 px-3.25 py-2.25 font-body text-[13px] text-ink-600">
              Mới nhất <DownChevronIcon size={14} />
            </span>
          </Reveal>

          {filtered.length > 0 ? (
            <Reveal delay="80ms" className="grid grid-cols-2 gap-5.5 max-sm:grid-cols-1">
              {filtered.map((r) => (
                <RecipeCard key={r.slug} recipe={r} isFav={isFavorite(r.slug)} onToggleFav={() => toggleFavorite(r.slug)} />
              ))}
            </Reveal>
          ) : (
            <div className="rounded-[18px] border border-dashed border-black/12 px-5 py-15 text-center text-ink-300">
              <div className="mb-3 flex justify-center text-ink-50">
                <SearchIcon size={42} className="stroke-[1.5]" />
              </div>
              <p className="mb-1 font-heading text-[15px] font-bold text-ink-900">Không tìm thấy công thức phù hợp</p>
              <p className="mb-4 text-[13px]">Thử bỏ bớt bộ lọc hoặc dùng từ khóa khác.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex rounded-full bg-cream-300 px-5.5 py-2.75 font-body text-[13px] font-semibold text-ink-800"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {filtered.length > 0 && (
            <Reveal className="mt-9 flex justify-center">
              <span className="inline-flex items-center gap-2.25 rounded-full border border-black/14 bg-white px-7 py-3.5 font-body text-sm font-semibold text-ink-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Xem thêm công thức <ArrowRightIcon size={17} />
              </span>
            </Reveal>
          )}
        </div>
      </div>

      <SiteFooter active="Công thức" />
    </div>
  );
}

function RecipeCard({
  recipe,
  isFav,
  onToggleFav,
}: {
  recipe: Recipe;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const diff = difficultyMeta(recipe.difficulty);
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="flex flex-col overflow-hidden rounded-[18px] border border-black/7 bg-white shadow-[0_6px_22px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_14px_30px_rgba(0,0,0,0.10)]"
    >
      <div className="relative overflow-hidden">
        <Placeholder label={recipe.imageLabel} className="h-50" />
        <span className="absolute left-3 top-3 rounded-lg bg-white px-2.75 py-1.25 font-body text-[11.5px] font-semibold text-ink-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          {recipe.category}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.25 font-body text-[11.5px] font-bold text-gold-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <StarIcon size={12} />
          {recipe.rating}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4.5">
        <div className="mb-2.25 flex items-center justify-between text-[11.5px] text-ink-300">
          <span className="flex items-center gap-1.5">
            <ChefHatIcon size={13} />
            {recipe.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon size={13} />
            {recipe.date}
          </span>
        </div>
        <h3 className="text-[21px] font-bold">{recipe.name}</h3>
        <p className="mt-1.75 line-clamp-3 text-[12.5px] leading-relaxed text-ink-500">{recipe.description}</p>
        <div className="mt-3.5 grid grid-cols-4 gap-1.75">
          <MiniStat label="Thời gian" value={recipe.time} icon={<ClockIcon size={14} />} />
          <MiniStat label="Khẩu phần" value={recipe.serve} icon={<UserIcon size={14} />} />
          <MiniStat
            label="Độ khó"
            value={recipe.difficulty}
            badge={
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full font-heading text-[10px] font-bold text-white"
                style={{ background: diff.color }}
              >
                {diff.num}
              </span>
            }
          />
          <MiniStat label="Đánh giá" value={recipe.rating} icon={<StarIcon size={14} className="text-gold-700" />} />
        </div>
        <div className="mt-3.5 flex items-center justify-between border-t border-black/6 pt-3">
          <div className="flex gap-1.75">
            <span className="rounded-md bg-cream-200 px-2.25 py-0.75 font-body text-[11px] font-medium text-ink-600">
              #{recipe.tags[0]}
            </span>
            {recipe.tags.length > 1 && (
              <span className="rounded-md bg-cream-200 px-2.25 py-0.75 font-body text-[11px] font-medium text-ink-600">
                +{recipe.tags.length - 1}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-ink-300">
            <span className="flex items-center gap-1">
              <EyeIcon size={14} />
              {recipe.views}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFav();
              }}
              className={`flex items-center gap-1 transition-transform active:scale-90 ${isFav ? "text-red-600" : ""}`}
            >
              <HeartIcon size={14} fill={isFav ? "currentColor" : "none"} />
              <span>{recipe.likes + (isFav ? 1 : 0)}</span>
            </button>
            <span className="flex items-center gap-1">
              <CommentIcon size={14} />0
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniStat({
  label,
  value,
  icon,
  badge,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-[11px] bg-cream-100 p-2.25 text-center">
      <div className="mb-0.75 flex justify-center text-ink-300">{icon ?? badge}</div>
      <div className="text-[9.5px] text-ink-300">{label}</div>
      <div className="font-heading text-xs font-bold">{value}</div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  badge,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="rounded-[13px] bg-cream-100 p-2.5 text-center">
      <div className="mb-1 flex justify-center text-ink-300">{icon ?? badge}</div>
      <div className="text-[10.5px] text-ink-300">{label}</div>
      <div className="font-heading text-[15px] font-bold">{value}</div>
    </div>
  );
}
