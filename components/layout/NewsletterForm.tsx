"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  if (subscribed) {
    return (
      <div className="flex flex-none items-center gap-2 rounded-[10px] border border-green-600/30 bg-cream-50 px-5 py-3 text-[13.5px] font-semibold text-green-600 max-sm:justify-center">
        ✓ Cảm ơn bạn đã đăng ký!
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-none gap-2.5 max-sm:flex-col">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="VD: email@domain.com"
        required
        aria-label="Email nhận tin"
        className="min-w-[230px] rounded-[10px] border border-black/12 bg-white px-4 py-3 text-[13px] text-ink-800 outline-none placeholder:text-ink-200 focus:border-black/25"
      />
      <button
        type="submit"
        className="rounded-[10px] bg-cream-300 px-[22px] py-3 font-body text-sm font-semibold text-ink-800 transition-transform hover:-translate-y-0.5"
      >
        Đăng Ký
      </button>
    </form>
  );
}
