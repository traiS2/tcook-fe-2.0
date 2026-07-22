"use client";

import Link from "next/link";
import { HeaderActions } from "./HeaderActions";
import { CalendarIcon, ChefHatIcon, FacebookIcon, HeartIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

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
  const [language, setLanguage] = useLocalStorageState<"vi" | "en">("tcook-language", "vi");

  return (
    <>
      {/* utility bar */}
      <div className={`flex items-center justify-between border-b border-black/5 py-1 text-xs text-ink-400 ${pageX}`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-ink-400 transition-[color,background-color,transform] duration-300 hover:scale-110 hover:bg-gradient-to-br hover:from-pink-500 hover:to-amber-400 hover:text-white"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-ink-400 transition-[color,background-color,transform] duration-300 hover:scale-110 hover:bg-blue-500 hover:text-white"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-ink-400 transition-[color,background-color,transform] duration-300 hover:scale-110 hover:bg-red-500 hover:text-white"
            >
              <YoutubeIcon size={18} />
            </a>
          </span>
          <span className="h-3.5 w-px bg-black/10" />
          <span className="flex items-center gap-1.5">
            <span className="font-script text-[18px] text-ink-800">
              Chào mừng đến với TCook
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
          <span className="inline-flex items-center gap-0.5 rounded-full border border-black/10 p-0.5 font-semibold text-ink-900">
            <button
              type="button"
              onClick={() => setLanguage("vi")}
              className={`rounded-full px-2 py-0.5 transition-colors ${language === "vi" ? "bg-cream-300 text-ink-800" : "text-ink-400 hover:text-ink-700"}`}
            >
              VI
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2 py-0.5 transition-colors ${language === "en" ? "bg-cream-300 text-ink-800" : "text-ink-400 hover:text-ink-700"}`}
            >
              EN
            </button>
          </span>
        </div>
      </div>

      {/* sticky header / nav */}
      <div className={`sticky top-0 z-[100] flex items-center justify-between border-b border-black/6 bg-white/92 py-1.5 backdrop-blur-md ${pageX}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-cream-300 text-ink-800">
            <ChefHatIcon size={22} />
          </span>
          <span className="font-heading text-[23px] font-bold text-ink-900">TCook</span>
        </Link>
        <div className="inline-flex gap-1 rounded-full border border-black/5 bg-cream-100 p-1">
          {NAV_LINKS.map((link) =>
            link.key === activeNav ? (
              <span
                key={link.key}
                className="rounded-full bg-cream-300 px-4.5 py-2 font-body text-sm font-semibold text-ink-800"
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-full px-4.5 py-2 font-body text-sm font-medium text-ink-600 transition-colors hover:bg-cream-200 hover:text-ink-900"
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
