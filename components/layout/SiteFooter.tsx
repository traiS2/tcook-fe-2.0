import Link from "next/link";
import { slugify } from "@/lib/format";
import { NewsletterForm } from "./NewsletterForm";
import {
  ChefHatIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  YoutubeIcon,
} from "@/components/icons";

const QUICK_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/recipes", label: "Công thức" },
  { href: "/categories", label: "Danh mục" },
  { href: "/favorites", label: "Món đã lưu" },
] as const;

const POPULAR_CATEGORIES = ["Món Chính", "Tráng Miệng", "Đồ Uống", "Ăn Sáng", "Món Chay"];

export function SiteFooter({ active, wide = false }: { active?: string; wide?: boolean }) {
  const pageX = wide ? "page-px-wide" : "page-px";

  return (
    <div className={`border-t border-black/6 bg-white pt-11 pb-5 ${pageX}`}>
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div>
          <Link href="/" className="mb-3.5 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-cream-300 text-ink-800">
              <ChefHatIcon size={20} />
            </span>
            <span className="font-heading text-xl font-bold text-ink-900">TCook</span>
          </Link>
          <p className="max-w-[260px] text-[13px] leading-relaxed text-ink-500">
            Khám phá thế giới ẩm thực đa dạng với những công thức độc đáo và hướng dẫn chi tiết từ các
            chuyên gia.
          </p>
          <p className="mt-3.5 text-[12.5px] text-ink-300">
            Được tạo với <span className="text-gold-700">♥</span> tại Việt Nam
          </p>
        </div>
        <div>
          <h4 className="mb-3.5 text-[15px]">Liên Kết Nhanh</h4>
          <div className="flex flex-col gap-2.5 text-[13.5px] text-ink-500">
            {QUICK_LINKS.map((link) =>
              link.label === active ? (
                <span key={link.href} className="font-semibold text-ink-900">
                  {link.label}
                </span>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
        <div>
          <h4 className="mb-3.5 text-[15px]">Danh Mục Phổ Biến</h4>
          <div className="flex flex-col gap-2.5 text-[13.5px] text-ink-500">
            {POPULAR_CATEGORIES.map((c) => (
              <Link key={c} href={`/categories/${slugify(c)}`} className="w-fit hover:text-ink-900">
                {c}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3.5 text-[15px]">Thông Tin Liên Hệ</h4>
          <div className="flex flex-col gap-2.5 text-[13px] text-ink-500">
            <a href="mailto:contact@tcook.vn" className="flex w-fit items-center gap-2 hover:text-ink-900">
              <MailIcon size={15} />
              contact@tcook.vn
            </a>
            <a href="tel:+84123456789" className="flex w-fit items-center gap-2 hover:text-ink-900">
              <PhoneIcon size={15} />
              +84 123 456 789
            </a>
            <span className="flex items-center gap-2">
              <MapPinIcon size={15} />
              Hồ Chí Minh, Việt Nam
            </span>
          </div>
          <div className="mt-4 flex gap-2.5">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/10 text-ink-600 transition-[color,background-color,border-color,transform] duration-300 hover:scale-110 hover:border-transparent hover:bg-blue-500 hover:text-white"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/10 text-ink-600 transition-[color,background-color,border-color,transform] duration-300 hover:scale-110 hover:border-transparent hover:bg-gradient-to-br hover:from-pink-500 hover:to-amber-400 hover:text-white"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/10 text-ink-600 transition-[color,background-color,border-color,transform] duration-300 hover:scale-110 hover:border-transparent hover:bg-red-500 hover:text-white"
            >
              <YoutubeIcon size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-[34px] flex items-center justify-between gap-6 rounded-2xl border border-black/5 bg-cream-100 px-7 py-[26px] max-sm:flex-col max-sm:items-stretch">
        <div>
          <h4 className="text-lg">Đăng Ký Nhận Tin</h4>
          <p className="mt-1.5 text-[13px] text-ink-500">
            Nhận những công thức mới nhất và tips nấu ăn hữu ích mỗi tuần
          </p>
        </div>
        <NewsletterForm />
      </div>

      <div className="mt-[22px] flex items-center justify-between border-t border-black/6 pt-[18px] text-xs text-ink-300 max-sm:flex-col max-sm:gap-1.5">
        <span>© 2026 TCook. Bảo lưu mọi quyền.</span>
        <span>
          Được phát triển bởi TCook · Thiết kế bởi <span className="font-semibold text-ink-900">TraiNH</span>
        </span>
      </div>
    </div>
  );
}
