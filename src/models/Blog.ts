import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  featuredImage?: string;
  language: "en" | "zh";
  status: "published" | "draft";
  tags?: string[];
  author?: string;
  readTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    language: { type: String, enum: ["en", "zh"], default: "en" },
    status: { type: String, enum: ["published", "draft"], default: "published" },
    tags: [{ type: String }],
    author: { type: String, default: "RoomScholars Team" },
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Index for faster queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ language: 1, status: 1, createdAt: -1 });

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
