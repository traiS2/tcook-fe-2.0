type IconProps = {
  size?: number;
  className?: string;
};

/**
 * Shared stroke-icon set (Feather/Lucide-style, hand-trimmed to the exact
 * paths used across the original TCook prototype) so every page references
 * one component instead of re-declaring the same <svg> markup.
 */

function base(size: number | undefined, className: string | undefined) {
  return {
    width: size ?? 18,
    height: size ?? 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  );
}

export function StarIcon({ size, className, fill = "currentColor" }: IconProps & { fill?: string }) {
  return (
    <svg width={size ?? 18} height={size ?? 18} viewBox="0 0 24 24" fill={fill} className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  );
}

export function HeartIcon(p: IconProps & { fill?: string }) {
  return (
    <svg {...base(p.size, p.className)} fill={p.fill ?? "none"}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function ChevronRightIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ChefHatIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

export function ShoppingBagIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function CopyIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function TrashIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function MailIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

export function MapPinIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function InstagramIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  );
}

export function FacebookIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function YoutubeIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export function EyeIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CommentIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ChecklistIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function SparkleIcon(p: IconProps & { fill?: string }) {
  return (
    <svg {...base(p.size, p.className)} fill={p.fill ?? "none"}>
      <path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z" />
    </svg>
  );
}

export function PlusMinusIcon() {
  return null;
}

export function CakeIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M4 4h16v6a8 8 0 0 1-16 0z" />
      <path d="M6 20h12" />
    </svg>
  );
}

export function PlateIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 11h18M4 6h16a1 1 0 0 1 1 1v3H3V7a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function SoupIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export function PotIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M8 3v3M12 3v3M16 3v3M4 9h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
    </svg>
  );
}

export function BowlIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function ListIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function BarsIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

export function GridIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function TagIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function BasketIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 11h18M6 15h.01M10 15h.01M4 6h16a1 1 0 0 1 1 1v3H3V7a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function TrendUpIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M4 3v7a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V3M7 13v8M17 3c-1.7 0-3 2-3 5s1 4 3 4v9" />
    </svg>
  );
}

export function BookOpenIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function LightbulbIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </svg>
  );
}

export function BoxIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M5 6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M9 4v4M15 4v4M9 12h.01M9 16h.01" />
    </svg>
  );
}

export function RotateCcwIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M3 2v6h6" />
      <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
  );
}

export function ShareIcon(p: IconProps) {
  return (
    <svg {...base(p.size, p.className)}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export const CATEGORY_ICONS = {
  cake: CakeIcon,
  plate: PlateIcon,
  sparkle: SparkleIcon,
  soup: SoupIcon,
  pot: PotIcon,
  bowl: BowlIcon,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;
