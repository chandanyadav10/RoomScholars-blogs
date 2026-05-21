import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${BASE_URL}/api/blogs`, { cache: "no-store" });
    if (res.ok) {
      const blogs = await res.json();
      blogEntries = blogs
        .filter((b: { status: string }) => b.status === "published")
        .map((blog: { slug: string; updatedAt?: string; createdAt: string }) => ({
          url: `${BASE_URL}/blogs/${blog.slug}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch { /* ignore */ }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...blogEntries,
  ];
}
