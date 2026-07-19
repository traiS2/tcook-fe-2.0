"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Fade-and-rise-in-on-scroll wrapper, replacing the `[data-reveal]` +
 * IntersectionObserver pattern that was hand-rolled in every original page.
 */
export function Reveal({
  children,
  delay,
  className,
  id,
}: {
  children: ReactNode;
  delay?: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // Deliberate: no observer support — reveal immediately instead of never.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 0) * 0.98 && rect.bottom > 0) {
      setVisible(true);
      io.unobserve(el);
    }
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: delay } : undefined;

  return (
    <div id={id} ref={ref} data-reveal className={[visible ? "in" : "", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
