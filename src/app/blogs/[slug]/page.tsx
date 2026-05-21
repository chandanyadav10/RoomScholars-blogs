export const revalidate = 60;

import { getSingleBlog } from "@/services/blog.service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getSingleBlog(slug);
    return {
      title: blog.title,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        type: "article",
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        images: blog.featuredImage ? [{ url: blog.featuredImage, width: 1200, height: 630 }] : [],
      },
      twitter: { card: "summary_large_image", title: blog.title, description: blog.description },
    };
  } catch {
    return { title: "Blog Not Found" };
  }
}

// Detect if content is HTML (from RichTextEditor) or plain text
function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  let blog;

  try {
    blog = await getSingleBlog(slug);
  } catch {
    notFound();
  }

  if (!blog || (blog as { error?: string }).error) notFound();

  const date = new Date(blog.createdAt).toLocaleDateString(
    blog.language === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const contentIsHTML = isHTML(blog.content || "");
  const paragraphs = contentIsHTML ? [] : (blog.content?.split("\n\n").filter(Boolean) || []);

  const backLabel = blog.language === "zh" ? "← 返回博客" : "← Back to Blogs";
  const premiumLabel = blog.language === "zh" ? "解锁高级内容 →" : "Unlock Premium Content →";

  return (
    <article>
      {/* Hero header */}
      <div className="bg-[#07122B] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Link href={`/blogs?lang=${blog.language}`} className="text-gray-400 hover:text-white transition text-sm">
              {backLabel}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="bg-[#F5A623] text-[#07122B] text-xs font-bold px-2.5 py-1 rounded-lg">
              {blog.language === "zh" ? "中文" : "English"}
            </span>
            {blog.status === "draft" && (
              <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2.5 py-1 rounded-lg border border-yellow-400/30">
                Draft
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            {blog.title}
          </h1>

          <p className="mt-5 text-gray-300 text-lg leading-relaxed">{blog.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center">
                <span className="text-[#07122B] font-bold text-xs">RS</span>
              </div>
              <span>{blog.author || "RoomScholars Team"}</span>
            </div>
            <span>•</span>
            <span>{date}</span>
            {blog.readTime && (<><span>•</span><span>{blog.readTime} min read</span></>)}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl mt-10">
            <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" priority
              sizes="(max-width: 768px) 100vw, 896px" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {contentIsHTML ? (
          // Render rich HTML from Tiptap
          <div
            className="prose-blog max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          // Render plain text paragraphs
          <div className="prose-blog max-w-none">
            {paragraphs.map((para, i) => (
              <p key={i} className="mb-6 text-gray-700 leading-[1.9] text-lg">{para}</p>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href={`/blogs?lang=${blog.language}`}
            className="inline-flex items-center gap-2 text-[#07122B] font-semibold hover:text-[#F5A623] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>
          <Link href="/pricing"
            className="bg-[#07122B] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0d1f4a] transition">
            {premiumLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
