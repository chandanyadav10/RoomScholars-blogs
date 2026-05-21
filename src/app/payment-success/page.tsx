import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful — RoomScholars",
};

function isValidToken(token: string | undefined, paymentId: string | undefined): boolean {
  if (!token || !paymentId) return false;
  if (!/^[0-9a-f]{32}$/.test(token)) return false;
  if (!/^pay_[A-Za-z0-9]{14,}$/.test(paymentId)) return false;
  return true;
}

const TEXT = {
  en: {
    title: "Payment Verified!",
    subtitle: "Your payment was verified and confirmed. You now have access to premium RoomScholars content.",
    paymentId: "Payment ID",
    explore: "Explore Premium Blogs",
    home: "Back to Home",
  },
  zh: {
    title: "付款已确认！",
    subtitle: "您的付款已验证并确认。您现在可以访问 RoomScholars 的高级内容。",
    paymentId: "付款编号",
    explore: "探索高级博客",
    home: "返回首页",
  },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; token?: string; lang?: string }>;
}) {
  const { payment_id, token, lang } = await searchParams;

  if (!isValidToken(token, payment_id)) {
    redirect("/pricing?error=invalid_payment");
  }

  const language = lang === "zh" ? "zh" : "en";
  const t = TEXT[language];

  const maskedId = payment_id
    ? `pay_••••••${payment_id.slice(-6)}`
    : "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1
          className="text-3xl font-bold text-navy"
          style={{ fontFamily: "Playfair Display, Georgia, serif" }}
        >
          {t.title}
        </h1>

        <p className="mt-3 text-gray-500">{t.subtitle}</p>

        {maskedId && (
          <p className="mt-3 text-xs text-gray-400 font-mono bg-gray-50 rounded-lg px-3 py-2 inline-block">
            {t.paymentId}: {maskedId}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/blogs?lang=${language}`}
            className="bg-navy text-white px-8 py-3 rounded-xl font-semibold hover:bg-navy-light transition"
          >
            {t.explore}
          </Link>
          <Link href={`/?lang=${language}`} className="text-gray-400 hover:text-gray-600 text-sm transition">
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
