# RoomScholars Blog Platform

A full-stack responsive blog platform built with **Next.js 15 App Router**, **Tailwind CSS v4**, **MongoDB**, **NextAuth.js**, **Tiptap** rich text editor, and **Razorpay** payment integration.

## ✅ Assignment Checklist

### Frontend
- ✅ Responsive UI (mobile + desktop) — Room Scholars navy `#07122B` / amber `#F5A623` theme
- ✅ Blog listing page (`/blogs?lang=en|zh`)
- ✅ Dynamic blog pages (`/blogs/[slug]`) with ISR
- ✅ **English + Chinese language support** — full translations on every page, navbar, footer, hero
- ✅ Blog preview mode (`/preview/[slug]`)
- ✅ Loading skeletons + error boundaries
- ✅ Lorem Ipsum dummy content (seeded via admin)

### SEO & Performance
- ✅ `generateMetadata` per blog (dynamic title, description, OG, Twitter)
- ✅ Open Graph + Twitter card tags
- ✅ `sitemap.ts` (dynamic, published blogs only)
- ✅ `robots.ts` (protects `/admin`, `/api`, `/preview`)
- ✅ `next/image` with `priority` on LCP images
- ✅ ISR (`revalidate: 60`) on all data pages

### Backend APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Fetch all blogs (`?language=en\|zh&search=&status=`) |
| POST | `/api/blogs` | Create a blog (auto-slug, auto-readTime) |
| GET | `/api/blogs/[slug]` | Fetch single blog |
| PUT | `/api/blogs/[slug]` | Update blog |
| DELETE | `/api/blogs/[slug]` | Delete blog |
| POST | `/api/create-order` | Create Razorpay order |

### Blog Schema (MongoDB/Mongoose)
```
title       String (required)
slug        String (required, unique)
description String (required)
content     String (required, supports HTML from Tiptap)
featuredImage String
language    "en" | "zh"
status      "published" | "draft"
tags        String[]
author      String
readTime    Number (auto-calculated)
createdAt   Date (auto)
updatedAt   Date (auto)
```

### Payment Integration (Razorpay Test Mode)
- ✅ Pricing page with 3 plans (Free / ₹499 / ₹999)
- ✅ Backend order creation API (`/api/create-order`)
- ✅ Razorpay checkout modal
- ✅ `/payment-success` redirect on success
- ✅ Failure handling + test-mode notice

### Bonus Features
- ✅ **Admin dashboard** — stats, CRUD, search, language filter
- ✅ **Tiptap rich text editor** — bold, italic, headings, lists, blockquotes, links, images, word count
- ✅ **NextAuth.js authentication** — CredentialsProvider, JWT sessions, middleware protecting `/admin`
- ✅ **Search & filter blogs** — by title/description + language
- ✅ Sample blog seeder (6 posts EN + ZH)
- ✅ README + `.env.example`
- ✅ Deploy-ready for Vercel

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd rs-blog
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/room-scholars
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-32-char-string
ADMIN_EMAIL=admin@roomscholars.com
ADMIN_PASSWORD=admin123
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Seed sample data

Go to [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin) → sign in → click **Seed Sample Data**

> **Demo credentials:** `admin@roomscholars.com` / `admin123`

---

## 🌐 Deploy to Vercel

```bash
npm i -g vercel && vercel --prod
```

Add all env vars in Vercel Dashboard → Project → Settings → Environment Variables. Change `NEXTAUTH_URL` to your production URL and generate a strong `NEXTAUTH_SECRET`.

---

## 🔑 Language System

Language is controlled by the `?lang=en|zh` URL query parameter:
- The **Navbar** language toggle preserves the current page and all other query params when switching
- The **Hero**, **Home**, **Blog listing**, **Footer** all translate based on `lang`
- **Blog documents** have a `language` field — the API filters by it so EN blogs appear in EN mode, ZH blogs in ZH mode
- **Single blog pages** use the blog's own language for date formatting and back button labels

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary (Navy) | `#07122B` |
| Accent (Amber) | `#F5A623` |
| Cream background | `#FBF8F3` |
| Heading font | Playfair Display |
| Body font | DM Sans |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home (ISR, bilingual)
│   ├── layout.tsx                  # Root layout + AuthProvider
│   ├── globals.css                 # Tailwind v4 + theme + prose
│   ├── middleware.ts               # NextAuth route protection
│   ├── blogs/
│   │   ├── page.tsx               # Blog listing (ISR, bilingual)
│   │   ├── loading.tsx            # Skeleton loader
│   │   ├── error.tsx              # Error boundary
│   │   └── [slug]/page.tsx        # Single blog (ISR, HTML+plaintext)
│   ├── admin/page.tsx             # Protected admin (auth required)
│   ├── auth/signin/page.tsx       # NextAuth sign-in page
│   ├── pricing/page.tsx           # Pricing + Razorpay
│   ├── payment-success/page.tsx   # Post-payment page
│   ├── preview/[slug]/page.tsx    # Draft preview
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   ├── blogs/route.ts         # GET all + POST
│   │   ├── blogs/[slug]/route.ts  # GET + PUT + DELETE
│   │   └── create-order/route.ts  # Razorpay order
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Navbar.tsx                 # Language-aware, auth-aware
│   ├── Footer.tsx                 # Language-aware
│   ├── Hero.tsx                   # Full bilingual translations
│   ├── BlogCard.tsx
│   ├── Container.tsx
│   ├── RichTextEditor.tsx         # Tiptap editor with toolbar
│   └── AuthProvider.tsx           # SessionProvider wrapper
├── lib/mongodb.ts
├── models/Blog.ts                 # Full Mongoose schema
└── services/blog.service.ts
```
