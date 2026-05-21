import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  // FIX: Auth protection — only logged-in admins can update blogs
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();

    if (body.content) {
      const words = body.content.split(/\s+/).length;
      body.readTime = Math.max(1, Math.ceil(words / 200));
    }

    const blog = await Blog.findOneAndUpdate({ slug }, body, { new: true });
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  // FIX: Auth protection — only logged-in admins can delete blogs
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { slug } = await params;
    await Blog.findOneAndDelete({ slug });
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
