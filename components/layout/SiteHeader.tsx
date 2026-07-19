import Link from "next/link";
import { HeaderActions } from "./HeaderActions";
import { CalendarIcon, ChefHatIcon, FacebookIcon, HeartIcon, InstagramIcon, SparkleIcon, YoutubeIcon } from "@/components/icons";

type NavKey = "home" | "recipes" | "categories";
type UtilityKey = "meal-planner" | "favorites";

const NAV_LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Trang chủ", href: "/" },
  { key: "recipes", label: "Công thức", href: "/recipes" },
  { key: "categories", label: "Danh mục", href: "/categories" },
];

export function SiteHeader({
  activeNav,
  activeUtility,
  wide = false,
}: {
  activeNav?: NavKey;
  activeUtility?: UtilityKey;
  wide?: boolean;
}) {
  const pageX = wide ? "page-px-wide" : "page-px";

  return (
    <>
      {/* utility bar */}
      <div className={`flex items-center justify-between border-b border-black/5 py-2.5 text-xs text-ink-400 ${pageX}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-xl p-2 text-ink-400 transition-[color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink-900/[0.06] hover:text-pink-500"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-xl p-2 text-ink-400 transition-[color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink-900/[0.06] hover:text-blue-500"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="rounded-xl p-2 text-ink-400 transition-[color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink-900/[0.06] hover:text-red-500"
            >
              <YoutubeIcon size={16} />
            </a>
          </span>
          <span className="h-3.5 w-px bg-black/10" />
          <span className="flex items-center gap-1.5">
            <SparkleIcon size={12} fill="currentColor" className="text-gold-600" />
            <span className="font-script text-[15px] text-ink-800">
              Chào mừng đến với TCook — Nấu ăn với tình yêu
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/meal-planner"
            className={`flex items-center gap-1.5 ${activeUtility === "meal-planner" ? "font-semibold text-ink-900" : "text-ink-400 hover:text-ink-900"}`}
          >
            <CalendarIcon size={14} />
            Lịch nấu ăn
          </Link>
          <Link
            href="/favorites"
            className={`flex items-center gap-1.5 ${activeUtility === "favorites" ? "font-semibold text-ink-900" : "text-ink-400 hover:text-ink-900"}`}
          >
            <HeartIcon size={14} fill={activeUtility === "favorites" ? "currentColor" : "none"} />
            Yêu thích
          </Link>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-cream-200 p-0.5 font-semibold text-ink-900">
            <span className="rounded-full bg-cream-300 px-2 py-0.5 text-ink-800">VI</span>
            <span className="px-1.5 py-0.5 text-ink-300">EN</span>
          </span>
        </div>
      </div>

      {/* sticky header / nav */}
      <div className={`sticky top-0 z-[100] flex items-center justify-between border-b border-black/6 bg-white/92 py-4 backdrop-blur-md ${pageX}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-cream-300 text-ink-800">
            <ChefHatIcon size={22} />
          </span>
          <span className="font-heading text-[23px] font-bold text-ink-900">TCook</span>
        </Link>
        <div className="inline-flex gap-1 rounded-full border border-black/5 bg-cream-100 p-1.5">
          {NAV_LINKS.map((link) =>
            link.key === activeNav ? (
              <span
                key={link.key}
                className="rounded-full bg-cream-300 px-5 py-2.5 font-body text-sm font-semibold text-ink-800"
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-full px-5 py-2.5 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-cream-200 hover:text-ink-900"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
        <HeaderActions />
      </div>
    </>
  );
}
