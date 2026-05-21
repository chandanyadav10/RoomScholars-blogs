import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2
          className="text-3xl font-bold text-[#07122B] mb-2"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Blog Not Found
        </h2>
        <p className="text-gray-500 mb-6">This blog post doesn&apos;t exist or may have been removed.</p>
        <Link
          href="/blogs"
          className="bg-[#07122B] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#0d1f4a] transition"
        >
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
}
