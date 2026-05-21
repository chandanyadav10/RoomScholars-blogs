export const revalidate = 60;

import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { getBlogs } from "@/services/blog.service";
import type { Metadata } from "next";
// import { Suspense } from "react";

export const metadata: Metadata = {
  title: "RoomScholars — Student Housing Blog Platform",
  description: "Discover modern accommodation guides, student living tips, and housing insights from around the world.",
  openGraph: {
    title: "RoomScholars — Student Housing Blog Platform",
    description: "Discover modern accommodation guides, student living tips, and housing insights.",
    type: "website",
  },
};

const WHY_ITEMS = {
  en: [
    { icon: "✓", title: "Verified & Trusted", desc: "All properties and listings are carefully verified for your peace of mind." },
    { icon: "📍", title: "Prime Locations", desc: "Stay close to universities, transport, and city attractions worldwide." },
    { icon: "🛋️", title: "Fully Furnished", desc: "Move in hassle-free with stylish furniture and modern amenities." },
    { icon: "📅", title: "Flexible Contracts", desc: "Choose short-term or long-term stays as per your student needs." },
    { icon: "🎧", title: "24/7 Support", desc: "Our team is always here to support you throughout your stay." },
    { icon: "💰", title: "Best Value", desc: "Premium stays at affordable prices with no hidden costs." },
  ],
  zh: [
    { icon: "✓", title: "认证可信", desc: "所有房源均经过严格验证，让您安心入住。" },
    { icon: "📍", title: "优越位置", desc: "靠近大学、交通枢纽和城市景点。" },
    { icon: "🛋️", title: "全套家具", desc: "配备时尚家具和现代设施，拎包即住。" },
    { icon: "📅", title: "灵活合同", desc: "可选择短期或长期住宿，满足您的留学需求。" },
    { icon: "🎧", title: "全天候支持", desc: "我们的团队随时为您提供支持与帮助。" },
    { icon: "💰", title: "超值优惠", desc: "以实惠的价格提供优质住宿，无隐藏费用。" },
  ],
};

const PAGE_TEXT = {
  en: {
    latest: "Latest Blogs",
    latestSub: "Latest Articles",
    noBlogs: "No blogs yet.",
    noBlogsSub: "Visit the admin dashboard to seed sample content.",
    goAdmin: "Go to Admin →",
    viewAll: "View All Blogs",
    why: "Why Choose RoomScholars?",
    whySub: "Why Us",
    ctaHead: "Ready to find your perfect student home?",
    ctaSub: "Explore our premium listings and unlock exclusive city guides today.",
    ctaBtn1: "Start Reading",
    ctaBtn2: "View Pricing",
  },
  zh: {
    latest: "最新博客",
    latestSub: "最新文章",
    noBlogs: "暂无博客，请稍后再来。",
    noBlogsSub: "请前往管理员页面添加内容。",
    goAdmin: "前往管理 →",
    viewAll: "查看全部博客",
    why: "为什么选择 RoomScholars？",
    whySub: "我们的优势",
    ctaHead: "准备好找到完美的学生住房了吗？",
    ctaSub: "立即探索我们的优质房源，解锁专属城市指南。",
    ctaBtn1: "开始阅读",
    ctaBtn2: "查看定价",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const language = (lang === "zh" ? "zh" : "en") as "en" | "zh";
  const t = PAGE_TEXT[language];
  const why = WHY_ITEMS[language];

  let blogs: string | any[] = [];
  try {
    blogs = await getBlogs(language);
  } catch {
    blogs = [];
  }

  const featured = blogs.slice(0, 3);

  return (
    <>
      <Hero lang={language} />

      {/* Featured Blogs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-amber text-sm font-semibold uppercase tracking-wider mb-2">{t.latestSub}</p>
              <h2 className="text-4xl font-bold text-navy" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                {t.latest}
              </h2>
            </div>
            
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500 text-lg font-medium">{t.noBlogs}</p>
              <p className="text-gray-400 text-sm mt-2">{t.noBlogsSub}</p>
              <Link href="/admin" className="mt-6 inline-block bg-navy text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-navy-light transition">
                {t.goAdmin}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featured.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
            </div>
          )}

          {blogs.length > 3 && (
            <div className="mt-12 text-center">
              <Link
                href={`/blogs?lang=${language}`}
                className="inline-flex items-center gap-2 bg-navy text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-navy-light transition-all"
              >
                {t.viewAll}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber text-sm font-semibold uppercase tracking-wider mb-3">{t.whySub}</p>
            <h2 className="text-4xl font-bold text-navy" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              {t.why}
            </h2>
            <div className="mt-3 w-16 h-1 bg-amber rounded mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {why.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-amber/20 transition-all duration-300 group">
                <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-amber transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-navy mb-2" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-navy">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            {t.ctaHead}
          </h2>
          <p className="text-gray-400 mb-8 text-lg">{t.ctaSub}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/blogs?lang=${language}`} className="bg-amber hover:bg-amber-dark text-navy font-bold px-8 py-3.5 rounded-xl transition-all">
              {t.ctaBtn1}
            </Link>
            <Link href="/pricing" className="border border-white/20 hover:bg-white/5 text-white font-semibold px-8 py-3.5 rounded-xl transition-all">
              {t.ctaBtn2}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
