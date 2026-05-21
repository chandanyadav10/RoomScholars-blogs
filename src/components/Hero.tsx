import Link from "next/link";
import Image from "next/image";

const translations = {
  en: {
    badge: "Student Housing Platform",
    heading1: "Find the Best",
    heading2: "Student Housing",
    heading3: "Worldwide",
    sub: "Discover modern accommodation guides, student living tips, and housing insights from cities around the globe.",
    cta1: "Explore Blogs",
    cta2: "View Pricing",
    stat1: { val: "500+", label: "Properties Listed" },
    stat2: { val: "20+", label: "Cities Covered" },
    stat3: { val: "2", label: "Languages" },
    badge2: "New this week",
    badge2val: "12 Blog Posts",
  },
  zh: {
    badge: "学生住房平台",
    heading1: "寻找最佳",
    heading2: "学生住房",
    heading3: "遍布全球",
    sub: "发现现代住宿指南、学生生活技巧，以及来自全球城市的住房见解。",
    cta1: "探索博客",
    cta2: "查看定价",
    stat1: { val: "500+", label: "已列出房源" },
    stat2: { val: "20+", label: "覆盖城市" },
    stat3: { val: "2", label: "支持语言" },
    badge2: "本周新增",
    badge2val: "12 篇文章",
  },
};

export default function Hero({ lang = "en" }: { lang?: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="relative bg-navy overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber/5 rounded-full blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle, #F5A623 1px, transparent 1px)`, backgroundSize: "32px 32px" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
              <span className="text-amber text-sm font-medium">{t.badge}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              {t.heading1}{" "}
              <span className="text-amber">{t.heading2}</span>{" "}
              {t.heading3}
            </h1>

            <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-lg">{t.sub}</p>

            <div className="mt-8 flex flex-wrap gap-8">
              {[t.stat1, t.stat2, t.stat3].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-amber">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/blogs?lang=${lang}`}
                className="inline-flex items-center gap-2 bg-amber hover:bg-amber-dark text-navy font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber/20"
              >
                {t.cta1}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200"
              >
                {t.cta2}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-amber/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber/20 shadow-2xl aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=80"
                alt="Student Housing"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-br from-navy/40 to-transparent" />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                <span className="text-amber text-lg">🏠</span>
              </div>
              <div>
                <div className="text-xs text-gray-500">{t.badge2}</div>
                <div className="text-sm font-bold text-navy">{t.badge2val}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
