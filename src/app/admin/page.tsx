"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const ADMIN_TEXT = {
  en: {
    dashboard: "Admin Dashboard",
    viewSite: "← View Site",
    total: "Total", published: "Published", drafts: "Drafts", english: "English", chinese: "Chinese",
    allBlogs: "All Blogs", createBlog: "+ Create Blog", seedBtn: "🌱 Seed Sample Data", seeding: "Seeding...",
    searchPlaceholder: "Search blogs...", allLanguages: "All Languages",
    loading: "Loading blogs...", noBlogs: "No blogs yet. Click 'Seed Sample Data' to get started.",
    noMatch: "No blogs match your search.",
    colTitle: "Title", colSlug: "Slug", colLang: "Lang", colStatus: "Status", colCreated: "Created", colActions: "Actions",
    view: "View", preview: "Preview", deleteBtn: "Delete",
    confirmDelete: "Delete this blog post?",
    blogDeleted: "🗑 Blog deleted.",
    createTitle: "Create New Blog Post",
    labelTitle: "Title *", labelSlug: "Slug *", labelDesc: "Description *",
    labelContent: "Content *", richText: "(rich text editor)",
    labelFeaturedImg: "Featured Image URL", labelAuthor: "Author",
    labelTags: "Tags", tagsHint: "(comma separated)", labelLanguage: "Language", labelStatus: "Status",
    btnCreate: "Create Blog Post", btnCreating: "Creating...", btnCancel: "Cancel",
    statusPublished: "Published", statusDraft: "Draft",
    langEN: "🇬🇧 English", langZH: "🇨🇳 中文 (Chinese)",
  },
  zh: {
    dashboard: "管理后台",
    viewSite: "← 查看网站",
    total: "总计", published: "已发布", drafts: "草稿", english: "英文", chinese: "中文",
    allBlogs: "所有博客", createBlog: "+ 创建博客", seedBtn: "🌱 填充示例数据", seeding: "填充中...",
    searchPlaceholder: "搜索博客...", allLanguages: "所有语言",
    loading: "加载博客中...", noBlogs: "暂无博客，请点击'填充示例数据'开始。",
    noMatch: "未找到匹配的博客。",
    colTitle: "标题", colSlug: "别名", colLang: "语言", colStatus: "状态", colCreated: "创建时间", colActions: "操作",
    view: "查看", preview: "预览", deleteBtn: "删除",
    confirmDelete: "确定要删除此博客吗？",
    blogDeleted: "🗑 博客已删除。",
    createTitle: "创建新博客文章",
    labelTitle: "标题 *", labelSlug: "别名 *", labelDesc: "描述 *",
    labelContent: "内容 *", richText: "（富文本编辑器）",
    labelFeaturedImg: "特色图片链接", labelAuthor: "作者",
    labelTags: "标签", tagsHint: "（逗号分隔）", labelLanguage: "语言", labelStatus: "状态",
    btnCreate: "创建博客文章", btnCreating: "创建中...", btnCancel: "取消",
    statusPublished: "已发布", statusDraft: "草稿",
    langEN: "🇬🇧 English", langZH: "🇨🇳 中文 (Chinese)",
  },
};

// Dynamically import Tiptap to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

type Blog = {
  _id: string;
  title: string;
  slug: string;
  language: string;
  status: string;
  author?: string;
  readTime?: number;
  createdAt: string;
};

type FormState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage: string;
  language: string;
  status: string;
  tags: string;
  author: string;
};

const defaultForm: FormState = {
  title: "", slug: "", description: "", content: "",
  featuredImage: "", language: "en", status: "published",
  tags: "", author: "RoomScholars Team",
};

const SAMPLE_BLOGS = [
  {
    title: "Finding Student Housing in London",
    slug: "student-housing-london",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Discover the best student neighbourhoods in London with our comprehensive guide.",
    content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p><h2>Key Areas to Consider</h2><ul><li>Central London — close to major universities</li><li>East London — more affordable options</li><li>South London — quieter neighbourhoods</li></ul><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>",
    featuredImage: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
    language: "en", status: "published", tags: ["London", "Housing"], author: "RoomScholars Team",
  },
  {
    title: "Top Student Neighbourhoods in Singapore",
    slug: "student-neighbourhoods-singapore",
    description: "Pellentesque habitant morbi tristique senectus et netus. Your complete guide to Singapore student living.",
    content: "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget.</p><h2>Best Areas for Students</h2><ul><li>Clementi — near NUS</li><li>Jurong East — affordable with good transport</li><li>Bugis — vibrant and central</li></ul><p>Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>",
    featuredImage: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800",
    language: "en", status: "published", tags: ["Singapore", "Guide"], author: "RoomScholars Team",
  },
  {
    title: "Budget Living Tips for International Students",
    slug: "budget-living-international-students",
    description: "Donec sed odio dui. Essential money-saving strategies for international students navigating life in a new city.",
    content: "<p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p><h2>Top Money-Saving Tips</h2><ol><li>Cook at home instead of eating out daily</li><li>Use student discount cards everywhere</li><li>Share accommodation to split costs</li><li>Use public transport instead of taxis</li></ol><p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>",
    featuredImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
    language: "en", status: "published", tags: ["Budget", "Tips"], author: "RoomScholars Team",
  },
  {
    title: "How to Choose a Student Flat in Melbourne",
    slug: "choose-student-flat-melbourne",
    description: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Your step-by-step guide to renting in Melbourne.",
    content: "<p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam id dolor id nibh ultricies vehicula ut id elit.</p><blockquote><p>Finding the right flat is the first step to a successful student life abroad.</p></blockquote><p>Maecenas faucibus mollis interdum. Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor fringilla.</p>",
    featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    language: "en", status: "published", tags: ["Melbourne", "Australia"], author: "RoomScholars Team",
  },
  {
    title: "在伦敦寻找学生住房",
    slug: "student-housing-london-zh",
    description: "Lorem ipsum dolor sit amet, 探索伦敦最适合学生居住的社区。全面的留学生住房指南。",
    content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 在伦敦寻找合适的学生住房可能是一项挑战。本文将为您提供一些有用的建议和技巧。</p><h2>重要区域</h2><ul><li>中央伦敦 — 靠近主要大学</li><li>东伦敦 — 价格更实惠</li><li>南伦敦 — 更安静的社区</li></ul><p>了解伦敦各个区域的特点，选择最适合您需求的地点。</p>",
    featuredImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
    language: "zh", status: "published", tags: ["伦敦", "住房"], author: "RoomScholars Team",
  },
  {
    title: "新加坡学生社区指南",
    slug: "student-neighbourhoods-singapore-zh",
    description: "探索新加坡最受学生欢迎的社区，了解租房、交通和生活设施。",
    content: "<p>新加坡是一个充满活力的城市，拥有众多适合学生的居住社区。</p><h2>最佳学生区域</h2><ul><li>克莱门蒂 — 靠近新加坡国立大学</li><li>裕廊东 — 交通便利且价格实惠</li><li>武吉士 — 繁华的市中心地段</li></ul><p>无论您是在国立大学、南洋理工大学还是其他院校就读，选择合适的住所都至关重要。</p>",
    featuredImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800",
    language: "zh", status: "published", tags: ["新加坡", "社区"], author: "RoomScholars Team",
  },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "zh" ? "zh" : "en";
  const t = ADMIN_TEXT[lang];

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [tab, setTab] = useState<"list" | "create">("list");
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin");
    }
  }, [status, router]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch { setBlogs([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  async function seedBlogs() {
    setSeeding(true);
    setMsg({ text: "", type: "" });
    let success = 0;
    for (const blog of SAMPLE_BLOGS) {
      try {
        await fetch("/api/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blog) });
        success++;
      } catch { /* continue */ }
    }
    setMsg({ text: `✅ ${success} ${lang === "zh" ? "篇示例博客填充完成！" : "sample blogs seeded!"}`, type: "success" });
    fetchBlogs();
    setSeeding(false);
  }

  async function deleteBlog(slug: string) {
    if (!confirm(t.confirmDelete)) return;
    await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    setMsg({ text: t.blogDeleted, type: "info" });
    fetchBlogs();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMsg({ text: "✅ Blog created successfully!", type: "success" });
        setForm(defaultForm);
        fetchBlogs();
        setTab("list");
      } else {
        const err = await res.json();
        setMsg({ text: `❌ ${err.error || "Failed to create blog."}`, type: "error" });
      }
    } catch { setMsg({ text: "❌ An error occurred.", type: "error" }); }
    finally { setSaving(false); }
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  }

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.slug.includes(search.toLowerCase());
    const matchLang = langFilter === "all" || b.language === langFilter;
    return matchSearch && matchLang;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
    en: blogs.filter((b) => b.language === "en").length,
    zh: blogs.filter((b) => b.language === "zh").length,
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center">
            <span className="text-navy font-bold text-sm">RS</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>{t.dashboard}</h1>
            <p className="text-gray-400 text-xs">{session.user?.name || session.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          {/* <div className="hidden sm:flex gap-1 bg-white/10 p-1 rounded-xl">
            {[{ code: "en", label: "EN" }, { code: "zh", label: "中文" }].map(({ code, label }) => (
              <Link key={code} href={`/admin?lang=${code}`}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${lang === code ? "bg-white text-[#07122B]" : "text-gray-300 hover:text-white"}`}>
                {label}
              </Link>
            ))}
          </div> */}
          <Link href={`/?lang=${lang}`} className="text-sm text-gray-300 hover:text-white transition">{t.viewSite}</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: t.total, value: stats.total, color: "bg-navy text-white" },
            { label: t.published, value: stats.published, color: "bg-green-50 text-green-700 border border-green-100" },
            { label: t.drafts, value: stats.draft, color: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
            { label: t.english, value: stats.en, color: "bg-blue-50 text-blue-700 border border-blue-100" },
            { label: t.chinese, value: stats.zh, color: "bg-red-50 text-red-700 border border-red-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-xs mt-1 opacity-70 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Message */}
        {msg.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            msg.type === "success" ? "bg-green-50 text-green-700 border border-green-100" :
            msg.type === "error" ? "bg-red-50 text-red-700 border border-red-100" :
            "bg-blue-50 text-blue-700 border border-blue-100"
          }`}>{msg.text}</div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <button onClick={() => setTab("list")} className={`px-5 py-2 rounded-xl font-medium text-sm transition ${tab === "list" ? "bg-navy text-white" : "bg-white text-gray-700 border hover:bg-gray-50"}`}>
            {t.allBlogs} ({blogs.length})
          </button>
          <button onClick={() => { setTab("create"); setMsg({ text: "", type: "" }); }} className={`px-5 py-2 rounded-xl font-medium text-sm transition ${tab === "create" ? "bg-navy text-white" : "bg-white text-gray-700 border hover:bg-gray-50"}`}>
            {t.createBlog}
          </button>
          <button onClick={seedBlogs} disabled={seeding} className="ml-auto px-5 py-2 rounded-xl font-medium text-sm bg-amber text-navy hover:bg-amber-dark disabled:opacity-50 transition">
            {seeding ? t.seeding : t.seedBtn}
          </button>
        </div>

        {/* Blog List Tab */}
        {tab === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
              <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
                className="border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy w-56" />
              <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                <option value="all">{t.allLanguages}</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                {t.loading}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p>{blogs.length === 0 ? t.noBlogs : t.noMatch}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t.colTitle}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 hidden md:table-cell">{t.colSlug}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t.colLang}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">{t.colStatus}</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 hidden lg:table-cell">{t.colCreated}</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600">{t.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((blog) => (
                      <tr key={blog._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-navy max-w-xs">
                          <span className="line-clamp-1">{blog.title}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs hidden md:table-cell">{blog.slug}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
                            {blog.language === "zh" ? "中文" : "EN"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${blog.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs hidden lg:table-cell">
                          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 justify-end">
                            <Link href={`/blogs/${blog.slug}`} target="_blank" className="text-navy hover:text-amber text-xs font-medium transition">{t.view}</Link>
                            <Link href={`/preview/${blog.slug}`} target="_blank" className="text-blue-600 hover:text-blue-800 text-xs font-medium transition">{t.preview}</Link>
                            <button onClick={() => deleteBlog(blog.slug)} className="text-red-500 hover:text-red-700 text-xs font-medium transition">{t.deleteBtn}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Blog Tab */}
        {tab === "create" && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h2 className="text-xl font-bold text-navy" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>{t.createTitle}</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelTitle}</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm"
                  placeholder="Your blog title..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelSlug}</label>
                <input type="text" required value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy font-mono text-sm"
                  placeholder="auto-generated-from-title" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelDesc}</label>
              <textarea required rows={2} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm"
                placeholder="A short description for the blog preview..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.labelContent} <span className="text-gray-400 font-normal">{t.richText}</span>
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelFeaturedImg}</label>
                <input type="url" value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm"
                  placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelAuthor}</label>
                <input type="text" value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelTags} <span className="text-gray-400 font-normal">{t.tagsHint}</span></label>
                <input type="text" value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm"
                  placeholder="London, Housing, Tips" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelLanguage}</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm">
                  <option value="en">{t.langEN}</option>
                  <option value="zh">{t.langZH}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.labelStatus}</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy text-sm">
                  <option value="published">{t.statusPublished}</option>
                  <option value="draft">{t.statusDraft}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" disabled={saving}
                className="bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-navy-light disabled:opacity-50 transition text-sm">
                {saving ? t.btnCreating : t.btnCreate}
              </button>
              <button type="button" onClick={() => { setTab("list"); setForm(defaultForm); }}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm">
                {t.btnCancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
