export const revalidate = 60;

import { getBlogs } from "@/services/blog.service";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs — RoomScholars",
  description: "Browse all student housing blogs, guides, and living tips from RoomScholars.",
};

const TEXT = {
  en: {
    badge: "Student Housing Insights",
    title: "All Blogs",
    sub: "Explore student housing guides, city living tips, and accommodation insights.",
    search: "Search blogs...",
    searchBtn: "Search",
    count: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
    clear: "clear",
    noBlogs: "No blogs found.",
    clearSearch: "Clear search",
    for: "for",
  },
  zh: {
    badge: "学生住房见解",
    title: "所有博客",
    sub: "探索学生住房指南、城市生活技巧和住宿见解。",
    search: "搜索博客...",
    searchBtn: "搜索",
    count: (n: number) => `${n} 篇文章`,
    clear: "清除",
    noBlogs: "未找到博客。",
    clearSearch: "清除搜索",
    for: "关于",
  },
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; search?: string }>;
}) {
  const { lang, search } = await searchParams;
  const language = (lang === "zh" ? "zh" : "en") as "en" | "zh";
  const t = TEXT[language];

  let blogs: any[] = [];
  try {
    blogs = await getBlogs(language);
  } catch {
    blogs = [];
  }

  const filtered = search
    ? blogs.filter(
        (b) =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.description?.toLowerCase().includes(search.toLowerCase())
      )
    : blogs;

  return (
    <div>
      {/* Page header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-amber text-sm font-semibold uppercase tracking-wider mb-2">{t.badge}</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            {t.title}
          </h1>
          <p className="mt-3 text-gray-400 max-w-lg">{t.sub}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex gap-2">
            <Link
              href={`/blogs?lang=en${search ? `&search=${search}` : ""}`}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${language === "en" ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              🇬🇧 English
            </Link>
            <Link
              href={`/blogs?lang=zh${search ? `&search=${search}` : ""}`}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${language === "zh" ? "bg-navy text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              🇨🇳 中文
            </Link>
          </div>

          <form method="GET" action="/blogs" className="flex gap-2 sm:ml-auto">
            <input type="hidden" name="lang" value={language} />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder={t.search}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy w-56"
            />
            <button type="submit" className="bg-amber text-navy font-bold px-5 py-2 rounded-xl text-sm hover:bg-amber-dark transition">
              {t.searchBtn}
            </button>
          </form>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          {t.count(filtered.length)}
          {search && (
            <span>
              {" "}{t.for} &ldquo;{search}&rdquo; —{" "}
              <Link href={`/blogs?lang=${language}`} className="text-navy underline">{t.clear}</Link>
            </span>
          )}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl text-gray-600 font-medium">{t.noBlogs}</p>
            {search && (
              <Link href={`/blogs?lang=${language}`} className="mt-4 inline-block text-navy hover:underline font-medium">
                {t.clearSearch}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
