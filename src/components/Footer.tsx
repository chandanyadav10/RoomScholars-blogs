"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FooterInner() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";

  const t = {
    tagline: lang === "zh" ? "学生住房与生活方式博客平台。" : "Student housing & lifestyle blog platform.",
    nav: lang === "zh" ? "导航" : "Navigation",
    home: lang === "zh" ? "首页" : "Home",
    blogs: lang === "zh" ? "博客" : "Blogs",
    pricing: lang === "zh" ? "定价" : "Pricing",
    admin: lang === "zh" ? "管理" : "Admin",
    languages: lang === "zh" ? "语言" : "Languages",
    rights: lang === "zh" ? "版权所有" : "All rights reserved",
  };

  return (
    <footer className="bg-[#07122B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center">
                <span className="text-[#07122B] font-bold text-sm">RS</span>
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                RoomScholars
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{t.tagline}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#F5A623] text-sm uppercase tracking-wider">{t.nav}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: `/?lang=${lang}`, label: t.home },
                { href: `/blogs?lang=${lang}`, label: t.blogs },
                { href: `/pricing?lang=${lang}`, label: t.pricing },
                { href: `/admin?lang=${lang}`, label: t.admin },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#F5A623] text-sm uppercase tracking-wider">{t.languages}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/blogs?lang=en" className="hover:text-white transition-colors">🇬🇧 English</Link>
              </li>
              <li>
                <Link href="/blogs?lang=zh" className="hover:text-white transition-colors">🇨🇳 中文 (Chinese)</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} RoomScholars. {t.rights}.</span>
          <span>Built with Next.js · MongoDB · Razorpay</span>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense fallback={<footer className="bg-[#07122B] h-48" />}>
      <FooterInner />
    </Suspense>
  );
}
