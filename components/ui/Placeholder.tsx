import type { CSSProperties } from "react";

/**
 * Diagonal-stripe "image" block with a centered label — stands in for real
 * photography everywhere the original design used a `.strp` placeholder.
 * Swap for `next/image` once real assets are wired up.
 */
export function Placeholder({
  label,
  className,
  style,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={["placeholder-img", className].filter(Boolean).join(" ")}
      data-label={label}
      style={style}
    />
  );
}
