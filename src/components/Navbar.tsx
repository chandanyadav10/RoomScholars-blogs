"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const currentLang = searchParams.get("lang") || "en";

  const buildLangHref = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    return `${pathname}?${params.toString()}`;
  };

  const links = [
    { href: "/", label: currentLang === "zh" ? "首页" : "Home" },
    { href: `/blogs?lang=${currentLang}`, label: currentLang === "zh" ? "博客" : "Blogs", match: "/blogs" },
    { href: `/pricing?lang=${currentLang}`, label: currentLang === "zh" ? "定价" : "Pricing", match: "/pricing" },
  ];

  // FIX: Home only matches "/", other links match their exact path
  const isActive = (link: { href: string; match?: string }) => {
    if (link.match) return pathname.startsWith(link.match);
    if (link.href === "/" || link.href.startsWith("/?")) return pathname === "/";
    return pathname === link.href;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/?lang=${currentLang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-amber font-bold text-sm">RS</span>
            </div>
            <span className="font-bold text-navy text-lg tracking-tight" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              Room<span className="text-amber">Scholars</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link)
                    ? "bg-navy text-white"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {[
                { code: "en", label: "EN" },
                { code: "zh", label: "中文" },
              ].map(({ code, label }) => (
                <Link
                  key={code}
                  href={buildLangHref(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currentLang === code
                      ? "bg-white text-navy shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {session ? (
              <div className="flex items-center gap-2">
                <Link href={`/admin?lang=${currentLang}`} className="text-sm text-gray-600 hover:text-navy px-3 py-1.5 rounded-lg transition">
                  {currentLang === "zh" ? "管理" : "Admin"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium px-3 py-1.5 rounded-lg transition"
                >
                  {currentLang === "zh" ? "退出" : "Sign Out"}
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-amber hover:bg-amber-dark text-navy font-semibold text-sm px-4 py-2 rounded-lg transition-all"
              >
                {currentLang === "zh" ? "登录" : "Admin →"}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(link) ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 px-1 pt-2">
            {[{ code: "en", label: "🇬🇧 English" }, { code: "zh", label: "🇨🇳 中文" }].map(({ code, label }) => (
              <Link
                key={code}
                href={buildLangHref(code)}
                onClick={() => setMobileOpen(false)}
                className={`flex-1 text-center py-2 rounded-xl text-xs font-semibold transition ${
                  currentLang === code ? "bg-navy text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full mt-1 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 text-center"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2 rounded-xl text-sm font-semibold bg-amber text-navy mt-2"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16" />
    }>
      <NavbarInner />
    </Suspense>
  );
}
