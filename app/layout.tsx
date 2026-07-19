import type { Metadata } from "next";
import { Quicksand, Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "TCook — Nấu ăn với tình yêu",
  description:
    "Khám phá công thức nấu ăn, lên lịch bữa ăn và tạo danh sách đi chợ cùng TCook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${quicksand.variable} ${beVietnamPro.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-ink-900 antialiased">{children}</body>
    </html>
  );
}
