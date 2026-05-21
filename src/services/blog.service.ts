const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage?: string;
  language: string;
  status: string;
  tags?: string[];
  author?: string;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

export async function getBlogs(language = "en"): Promise<Blog[]> {
  const res = await fetch(`${BASE_URL}/api/blogs?language=${language}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getAllBlogs(): Promise<Blog[]> {
  const res = await fetch(`${BASE_URL}/api/blogs`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getSingleBlog(slug: string): Promise<Blog> {
  const res = await fetch(`${BASE_URL}/api/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}
