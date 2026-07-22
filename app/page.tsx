"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentViews } from "@/hooks/useRecentViews";
import { CATEGORIES, RECIPES, FEATURED_RECIPE_SLUG, getRecipeBySlug } from "@/lib/data";
import { categoryHeadColor, difficultyMeta, shortTime } from "@/lib/format";
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CheckSquareIcon,
  ChefHatIcon,
  ClockIcon,
  GridIcon,
  HeartIcon,
  SparkleIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";

const WHY_CARDS = [
  {
    title: "Công Thức Chất Lượng",
    desc: "Mỗi công thức đều được tuyển chọn và kiểm tra kỹ lưỡng bởi đội ngũ đầu bếp chuyên nghiệp.",
    icon: AwardIcon,
  },
  {
    title: "Hướng Dẫn Chi Tiết",
    desc: "Từng bước được giải thích rõ ràng, kèm theo tips và tricks để bạn thành công ngay lần đầu.",
    icon: BookOpenIcon,
  },
  {
    title: "Cộng Đồng Yêu Thương",
    desc: "Kết nối với hàng nghìn người yêu nấu ăn, chia sẻ kinh nghiệm và học hỏi lẫn nhau.",
    icon: HeartIcon,
  },
];

const STRIP_CATEGORIES = CATEGORIES.filter((c) => c.name !== "Bánh Ngọt");

export default function HomePage() {
  const { favoriteSlugs } = useFavorites();
  const { viewedSlugs } = useRecentViews();

  const { picks, recoSub } = useMemo(() => {
    const savedSet = new Set(favoriteSlugs);
    const catCount: Record<string, number> = {};
    const ingCount: Record<string, number> = {};
    const addProfile = (slug: string, weight: number) => {
      const recipe = getRecipeBySlug(slug);
      if (!recipe) return;
      catCount[recipe.category] = (catCount[recipe.category] || 0) + weight;
      recipe.ingredients.forEach((i) => {
        ingCount[i] = (ingCount[i] || 0) + weight;
      });
    };
    favoriteSlugs.forEach((s) => addProfile(s, 2));
    viewedSlugs.forEach((s) => addProfile(s, 1));
    const hasHistory = favoriteSlugs.length + viewedSlugs.length > 0;

    const scored = RECIPES.filter((r) => !savedSet.has(r.slug)).map((r) => {
      const catMatch = (catCount[r.category] || 0) > 0;
      const ingMatch = r.ingredients.some((i) => (ingCount[i] || 0) > 0);
      const score =
        (catCount[r.category] || 0) * 2 +
        r.ingredients.reduce((a, i) => a + (ingCount[i] || 0), 0) +
        parseFloat(r.rating) * 0.1;
      const reason = hasHistory
        ? catMatch
          ? `Hợp gu · ${r.category}`
          : ingMatch
            ? "Nguyên liệu bạn thích"
            : "Đáng thử"
        : "Gợi ý cho bạn";
      return { ...r, score, reason };
    });

    scored.sort((a, b) =>
      hasHistory ? b.score - a.score : parseFloat(b.rating) - parseFloat(a.rating)
    );

    return {
      picks: scored.slice(0, 4),
      recoSub: hasHistory
        ? "Gợi ý riêng dựa trên món bạn đã lưu và đã xem gần đây"
        : "Lưu vài món yêu thích để TCook gợi ý riêng cho bạn — dưới đây là những món được yêu thích nhất",
    };
  }, [favoriteSlugs, viewedSlugs]);

  const featured = getRecipeBySlug(FEATURED_RECIPE_SLUG)!;
  const sideRecipes = RECIPES.filter((r) => r.slug !== FEATURED_RECIPE_SLUG).slice(0, 2);

  return (
    <div className="min-h-screen w-full bg-white">
      <SiteHeader activeNav="home" />

      <div className="bg-gradient-to-b from-cream-50 to-white">
        {/* hero */}
        <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-11 page-px pt-6.5 pb-14 max-lg:grid-cols-1">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-cream-200 px-3.5 py-1.5 font-body text-xs font-semibold tracking-[0.02em] text-ink-600">
              <SparkleIcon size={14} />
              Công thức · Mẹo vặt · Cảm hứng bếp núc
            </span>
            <h1 className="mt-5 text-[56px] font-bold leading-[1.06] tracking-tight max-sm:text-4xl">
              Nấu Ăn Ngon
              <br />
              Mỗi Ngày
            </h1>
            <p className="font-script mt-3.5 text-[26px] text-ink-700">
              Nấu những bữa ăn cho người bạn yêu thương
            </p>
            <p className="mt-4 max-w-[430px] text-[15px] leading-relaxed text-ink-500">
              Hôm nay nấu gì? Ở đây có hàng trăm công thức dễ làm, mẹo bếp núc hay ho và cả những
              món &ldquo;tủ&rdquo; được nhiều người yêu thích — cứ thong thả lướt qua và chọn món hợp ý bạn.
            </p>
            <div className="mt-6.5 flex flex-wrap gap-3">
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 rounded-full bg-cream-300 px-6 py-3.5 font-body text-sm font-semibold text-ink-800 transition-all hover:-translate-y-0.5 hover:bg-cream-400 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
              >
                <ChefHatIcon size={18} />
                Khám phá ngay
                <ArrowRightIcon size={17} />
              </Link>
              <Link
                href="/favorites"
                className="inline-flex items-center gap-2 rounded-full border border-black/14 bg-white px-6 py-3.5 font-body text-sm font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:border-black/28 hover:bg-cream-50"
              >
                <HeartIcon size={18} />
                Yêu thích
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-[7px] rounded-[10px] border border-black/5 bg-cream-100 px-[13px] py-[9px] font-body text-[12.5px] font-medium text-ink-600">
                <ClockIcon size={14} />
                Cập nhật mỗi tuần
              </span>
              <span className="inline-flex items-center gap-[7px] rounded-[10px] border border-black/5 bg-cream-100 px-[13px] py-[9px] font-body text-[12.5px] font-medium text-ink-600">
                <CheckSquareIcon size={14} />
                Hướng dẫn từng bước
              </span>
              <span className="inline-flex items-center gap-[7px] rounded-[10px] border border-black/5 bg-cream-100 px-[13px] py-[9px] font-body text-[12.5px] font-medium text-ink-600">
                <UsersIcon size={14} />
                Cộng đồng yêu bếp
              </span>
            </div>
          </Reveal>

          <Reveal delay="140ms" className="relative">
            <Placeholder
              label={featured.imageLabel}
              className="rounded-[22px] shadow-[0_30px_60px_rgba(0,0,0,0.14)]"
              style={{ aspectRatio: "4 / 4.3" }}
            />
            <div className="absolute left-[-22px] top-6.5 flex items-center gap-2.5 rounded-2xl border border-black/6 bg-white px-4 py-3 shadow-[0_14px_30px_rgba(0,0,0,0.12)] [animation:floatY_5.5s_ease-in-out_infinite]">
              <span className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                <StarIcon size={18} />
              </span>
              <div>
                <div className="font-heading text-[15px] font-bold text-ink-900">5.0 · Nổi bật</div>
                <div className="text-[11px] text-ink-300">Công thức tuần này</div>
              </div>
            </div>
            <div className="absolute bottom-6 right-[-18px] rounded-2xl bg-cream-300 px-4.5 py-3.5 text-ink-800 shadow-[0_14px_30px_rgba(0,0,0,0.2)] [animation:floatY2_6.5s_ease-in-out_infinite]">
              <div className="font-heading text-xl font-bold">4g 55p</div>
              <div className="text-[11px] text-[#6b6055]">Không cần lò nướng</div>
            </div>
          </Reveal>
        </div>

        {/* featured section */}
        <div className="border-t border-black/5 bg-cream-50 py-13 page-px">
          <Reveal className="mb-6.5 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
                <HeartIcon size={15} />
                Được yêu thích
              </span>
              <h2 className="mt-2 text-[34px] font-bold">Món Ngon Được Yêu Thích</h2>
            </div>
            <Link href="/recipes" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-ink-900">
              Xem tất cả <ArrowRightIcon size={16} />
            </Link>
          </Reveal>

          <Reveal delay="80ms" className="grid grid-cols-[1.35fr_1fr] gap-5.5 max-lg:grid-cols-1">
            <FeaturedRecipeCard slug={featured.slug} />
            <div className="flex flex-col gap-5.5">
              {sideRecipes.map((r) => (
                <SideRecipeCard key={r.slug} slug={r.slug} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* dành cho bạn */}
        <div className="border-t border-black/5 py-13 page-px">
          <Reveal className="mb-6 flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
                <SparkleIcon size={15} />
                Gợi ý riêng
              </span>
              <h2 className="mt-2 text-[34px] font-bold">Dành Cho Bạn</h2>
              <p className="mt-2 text-sm text-ink-500">{recoSub}</p>
            </div>
            <Link href="/favorites" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-ink-900">
              Món đã lưu <ArrowRightIcon size={16} />
            </Link>
          </Reveal>
          <Reveal delay="80ms" className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {picks.map((p) => {
              const diff = difficultyMeta(p.difficulty);
              return (
                <Link
                  key={p.slug}
                  href={`/recipes/${p.slug}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_16px_34px_rgba(0,0,0,0.07)]"
                >
                  <div
                    className="flex h-23 items-start justify-between p-3"
                    style={{ background: categoryHeadColor(p.category) }}
                  >
                    <span className="rounded-lg bg-white px-2.5 py-1.5 font-body text-[11px] font-semibold text-ink-600 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-body text-[11px] font-bold text-gold-700 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                      <StarIcon size={12} />
                      {p.rating}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5 p-4">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-cream-300 px-2.5 py-1 font-body text-[10.5px] font-semibold text-[#5a4e3a]">
                      <HeartIcon size={10} fill="currentColor" />
                      {p.reason}
                    </span>
                    <h4 className="text-[17px] font-bold leading-tight text-ink-900">{p.name}</h4>
                    <div className="flex flex-wrap gap-3 text-[11.5px] text-ink-600">
                      <span className="flex items-center gap-1.5">
                        <ClockIcon size={13} />
                        {p.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserIcon size={13} />
                        {p.serve}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: diff.color }} />
                        {p.difficulty}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Reveal>
        </div>

        {/* categories strip */}
        <div className="border-t border-black/5 py-13 page-px">
          <Reveal className="mb-6 flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-300">
                <GridIcon size={15} />
                Danh mục
              </span>
              <h2 className="mt-2 text-[34px] font-bold">Khám Phá Danh Mục</h2>
              <p className="mt-2 text-sm text-ink-500">
                Tìm món ăn yêu thích theo từng danh mục đặc biệt của bạn
              </p>
            </div>
          </Reveal>
          <Reveal delay="80ms" className="grid grid-cols-5 gap-3.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
            {STRIP_CATEGORIES.map((c) => {
              const Icon = c.icon === "cake" ? SparkleIcon : undefined;
              return (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-black/5 bg-cream-100 p-5 transition-all hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_12px_26px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/6 bg-white text-ink-600">
                    {Icon ? <Icon size={22} /> : <SparkleIcon size={22} />}
                  </span>
                  <div>
                    <h4 className="text-lg">{c.name}</h4>
                    {c.count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-ink-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3aa76d]" />
                        {c.count} công thức có sẵn
                      </span>
                    ) : (
                      <span className="text-xs text-ink-200">Đang cập nhật</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </Reveal>
        </div>

        {/* why */}
        <div className="border-t border-black/5 bg-cream-50 py-13 page-px">
          <Reveal className="mb-7 text-center">
            <h2 className="text-[32px] font-bold">Tại Sao Chọn TCook?</h2>
            <p className="mt-2 text-sm text-ink-500">
              Những lý do khiến TCook trở thành điểm đến tin cậy cho hành trình ẩm thực của bạn
            </p>
          </Reveal>
          <Reveal delay="80ms" className="grid grid-cols-3 gap-4.5 max-sm:grid-cols-1">
            {WHY_CARDS.map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/6 bg-white p-6.5 transition-all hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_14px_30px_rgba(0,0,0,0.06)]"
              >
                <span className="flex h-12.5 w-12.5 items-center justify-center rounded-[13px] border border-black/6 bg-gradient-to-br from-cream-200 to-white text-ink-900 shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
                  <Icon size={24} />
                </span>
                <h4 className="mt-4 mb-2 text-xl">{title}</h4>
                <p className="text-[13.5px] leading-relaxed text-ink-500">{desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <SiteFooter active="Trang chủ" />
    </div>
  );
}

function FeaturedRecipeCard({ slug }: { slug: string }) {
  const r = getRecipeBySlug(slug)!;
  const diff = difficultyMeta(r.difficulty);
  return (
    <Link
      href={`/recipes/${r.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-black/7 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_16px_34px_rgba(0,0,0,0.07)]"
    >
      <Placeholder label={r.imageLabel} className="h-57.5" />
      <div className="px-5.5 pt-5 pb-5.5">
        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-cream-200 px-3 py-1.5 font-body text-xs font-semibold text-ink-600">
            {r.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-gold-300 bg-gold-100 px-3 py-1.5 font-body text-xs font-bold text-gold-700">
            <StarIcon size={12} />
            Nổi bật
          </span>
        </div>
        <div className="mt-3.5 mb-1.5 flex items-center justify-between text-[12.5px] text-ink-300">
          <span className="flex items-center gap-1.5">
            <ChefHatIcon size={14} />
            {r.author}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon size={14} />
            {r.date}
          </span>
        </div>
        <h3 className="mt-1.5 mb-2 text-2xl font-bold">{r.name}</h3>
        <p className="line-clamp-3 text-[13.5px] leading-relaxed text-ink-500">{r.description}</p>
        <div className="mt-4.5 grid grid-cols-4 gap-2">
          <StatBox label="Thời gian" value={shortTime(r.time)} icon={<ClockIcon size={15} />} />
          <StatBox label="Khẩu phần" value={r.serve} icon={<UserIcon size={15} />} />
          <StatBox
            label="Độ khó"
            value={r.difficulty}
            badge={
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full font-heading text-[10px] font-bold text-white"
                style={{ background: diff.color }}
              >
                {diff.num}
              </span>
            }
          />
          <StatBox label="Đánh giá" value={r.rating} icon={<StarIcon size={15} className="text-gold-700" />} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-3.5 text-xs text-ink-300">
          <span className="flex gap-2">
            <span className="rounded-md bg-cream-200 px-2.5 py-0.5 text-ink-600">#{r.tags[0]}</span>
            {r.tags.length > 1 && <span className="rounded-md bg-cream-200 px-2.5 py-0.5 text-ink-600">+{r.tags.length - 1}</span>}
          </span>
          <span className="flex gap-3.5">
            <span className="flex items-center gap-1">{r.views}</span>
            <span className="flex items-center gap-1">
              <HeartIcon size={14} />
              {r.likes}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function SideRecipeCard({ slug }: { slug: string }) {
  const r = getRecipeBySlug(slug)!;
  return (
    <Link
      href={`/recipes/${r.slug}`}
      className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:border-black/12 hover:shadow-[0_14px_30px_rgba(0,0,0,0.07)]"
    >
      <div
        className="flex h-25 items-start justify-between p-3.5"
        style={{ background: `linear-gradient(135deg, #ecebe6, #f6f4f0)` }}
      >
        <span className="rounded-lg bg-white px-2.5 py-1.5 font-body text-[11.5px] font-semibold text-ink-600 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
          {r.category}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-body text-[11.5px] font-bold text-gold-700 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
          <StarIcon size={12} />
          {r.rating}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4.5">
        <div className="flex items-center justify-between text-[11.5px] text-ink-300">
          <span className="flex items-center gap-1.5">
            <ChefHatIcon size={13} />
            {r.author}
          </span>
          <span>{r.date}</span>
        </div>
        <h4 className="text-[19px] font-bold text-ink-900">{r.name}</h4>
        <p className="text-[12.5px] leading-relaxed text-ink-500">{r.description}</p>
        <div className="mt-0.5 flex gap-3.5 text-xs text-ink-600">
          <span className="flex items-center gap-1.5">
            <ClockIcon size={14} />
            {r.time}
          </span>
          <span className="flex items-center gap-1.5">
            <UserIcon size={14} />
            {r.serve}
          </span>
          <span>{r.difficulty}</span>
        </div>
      </div>
    </Link>
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
    <div className="rounded-[11px] bg-cream-100 px-2 py-[11px] text-center">
      <div className="mb-[5px] flex justify-center text-ink-300">{icon ?? badge}</div>
      <div className="text-[10px] text-ink-300">{label}</div>
      <div className="font-heading text-[13px] font-bold">{value}</div>
    </div>
  );
}
