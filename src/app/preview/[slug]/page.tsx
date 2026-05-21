import { getSingleBlog } from "@/services/blog.service";
import Image from "next/image";
import Link from "next/link";

// FIX: Same isHTML helper as the main blog page — renders Tiptap HTML correctly
function isHTML(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

export default async function PreviewBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getSingleBlog(slug);

  const contentIsHTML = isHTML(blog.content || "");
  const paragraphs = contentIsHTML ? [] : (blog.content?.split("\n\n").filter(Boolean) || []);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Preview Banner */}
      <div className="bg-amber text-navy text-center py-3 font-bold text-sm flex items-center justify-center gap-3">
        <span>👁 Preview Mode</span>
        <span className="font-normal">— This blog may not be published yet</span>
        <Link href={`/admin`} className="underline font-bold ml-2">Go to Admin</Link>
      </div>

      {/* Header */}
      <div className="bg-navy/95 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1
            className="text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            {blog.title}
          </h1>
          <p className="mt-4 text-gray-300 text-lg">{blog.description}</p>
        </div>
      </div>

      {blog.featuredImage && (
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="relative h-72 rounded-2xl overflow-hidden shadow-xl">
            <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {contentIsHTML ? (
          // FIX: Render rich HTML from Tiptap correctly
          <div
            className="prose-blog max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        ) : (
          <div className="prose-blog">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-5 text-gray-700 leading-[1.9] text-lg">{p}</p>
            ))}
          </div>
        )}
        <div className="mt-12 pt-6 border-t">
          <Link href="/admin" className="text-navy font-semibold hover:text-amber transition">
            ← Back to Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
