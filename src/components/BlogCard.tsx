import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/services/blog.service";

const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=75",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=75",
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=75",
  "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=75",
];

export default function BlogCard({ blog, index = 0 }: { blog: Blog; index?: number }) {
  const hasImage =
    blog.featuredImage &&
    (blog.featuredImage.startsWith("http") || blog.featuredImage.startsWith("/"));

  const fallbackImage = CARD_IMAGES[index % CARD_IMAGES.length];
  const imageSrc = hasImage ? blog.featuredImage! : fallbackImage;

  const date = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <Link href={`/blogs/${blog.slug}`} className="block relative h-52 overflow-hidden bg-navy">
        <Image
          src={imageSrc}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-amber text-navy text-xs font-bold px-2 py-1 rounded-md">
            {blog.language === "zh" ? "中文" : "EN"}
          </span>
          {blog.status === "draft" && (
            <span className="bg-gray-900/70 text-white text-xs px-2 py-1 rounded-md">
              Draft
            </span>
          )}
        </div>

        {blog.readTime && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">
              {blog.readTime} min read
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex gap-2 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-navy bg-blue-50 px-2 py-0.5 rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link href={`/blogs/${blog.slug}`}>
          <h2 className="text-lg font-bold text-navy line-clamp-2 group-hover:text-amber transition-colors leading-snug" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            {blog.title}
          </h2>
        </Link>

        <p className="mt-2 text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">
          {blog.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-navy flex items-center justify-center">
              <span className="text-amber text-xs font-bold">RS</span>
            </div>
            <span className="text-xs text-gray-400">{blog.author || "RoomScholars"}</span>
          </div>

          <div className="flex items-center gap-3">
            {date && <span className="text-xs text-gray-400">{date}</span>}
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-xs font-semibold text-navy hover:text-amber transition-colors"
            >
              Read →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
