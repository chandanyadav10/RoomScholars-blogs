"use client";

import Link from "next/link";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

async function handlePayment(amount: number, planName: string) {
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR" }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Payment setup failed: ${err.error}\n\nMake sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in your .env file.`);
      return;
    }

    const order = await res.json();

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "RoomScholars",
      description: `${planName} Plan`,
      order_id: order.id,
      handler: async function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.verified) {
            alert("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
            return;
          }

          window.location.href = `/payment-success?payment_id=${verifyData.payment_id}&token=${verifyData.token}`;
        } catch {
          alert("Verification error. Please contact support.");
        }
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#07122B" },
      modal: {
        ondismiss: function () {
          console.log("Payment dismissed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () {
      alert("Payment failed. Please try again.");
    });
    rzp.open();
  } catch {
    alert("An error occurred. Please try again.");
  }
}

const PRICING_TEXT = {
  en: {
    badge: "Simple Pricing",
    title: "Choose Your Plan",
    subtitle: "Unlock premium student housing content and exclusive city guides for your journey.",
    mostPopular: "Most Popular",
    perYear: "per year",
    oneTime: "one-time",
    forever: "Forever",
    getStarted: "Get Started",
    buyNow: "Buy Now",
    secure: "Secure payments via Razorpay",
    testMode: "Test mode — no real charges",
    support: "24/7 support included",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "Is this a real payment?", a: "No — all payments use Razorpay test mode. No real money is charged." },
      { q: "Can I cancel anytime?", a: "Yes, the Pro plan can be cancelled at any time from your dashboard." },
      { q: "What payment methods are supported?", a: "Razorpay supports cards, UPI, net banking, and wallets." },
      { q: "Do I need a Razorpay account?", a: "No, you only need a payment method. Razorpay handles the rest." },
    ],
    plans: [
      {
        name: "Basic",
        price: "Free",
        amount: 0,
        priceNote: "Forever",
        badge: null,
        description: "For students just getting started",
        features: [
          "Access to all blog posts",
          "English & Chinese language support",
          "Basic search & filters",
          "Mobile-friendly interface",
        ],
        cta: "Get Started",
        href: "/blogs",
        highlighted: false,
      },
      {
        name: "Premium",
        price: "₹499",
        amount: 499,
        priceNote: "one-time",
        badge: "Most Popular",
        description: "Best for students studying abroad",
        features: [
          "Everything in Basic",
          "Priority housing listings",
          "Exclusive city guides",
          "Email support",
          "Early access to new content",
        ],
        cta: "Buy Now",
        href: null,
        highlighted: true,
      },
      {
        name: "Pro",
        price: "₹999",
        amount: 999,
        priceNote: "per year",
        badge: null,
        description: "For housing advisors & agents",
        features: [
          "Everything in Premium",
          "Admin dashboard access",
          "Create & publish blogs",
          "Analytics dashboard",
          "Dedicated support",
        ],
        cta: "Buy Now",
        href: null,
        highlighted: false,
      },
    ],
  },
  zh: {
    badge: "简单定价",
    title: "选择您的套餐",
    subtitle: "解锁优质学生住房内容和专属城市指南，助您留学之旅更顺畅。",
    mostPopular: "最受欢迎",
    perYear: "每年",
    oneTime: "一次性",
    forever: "永久免费",
    getStarted: "立即开始",
    buyNow: "立即购买",
    secure: "通过 Razorpay 安全支付",
    testMode: "测试模式 — 不产生真实费用",
    support: "全天候客服支持",
    faqTitle: "常见问题",
    faqs: [
      { q: "这是真实付款吗？", a: "不是 — 所有付款均使用 Razorpay 测试模式，不会产生真实费用。" },
      { q: "我可以随时取消吗？", a: "可以，Pro 套餐可随时从您的仪表板取消。" },
      { q: "支持哪些付款方式？", a: "Razorpay 支持信用卡、UPI、网上银行和钱包付款。" },
      { q: "我需要 Razorpay 账户吗？", a: "不需要，您只需要付款方式即可，Razorpay 会处理其余事务。" },
    ],
    plans: [
      {
        name: "基础版",
        price: "免费",
        amount: 0,
        priceNote: "永久免费",
        badge: null,
        description: "适合刚开始的学生",
        features: [
          "访问所有博客文章",
          "英语和中文语言支持",
          "基本搜索和筛选",
          "移动端友好界面",
        ],
        cta: "立即开始",
        href: "/blogs?lang=zh",
        highlighted: false,
      },
      {
        name: "高级版",
        price: "₹499",
        amount: 499,
        priceNote: "一次性",
        badge: "最受欢迎",
        description: "最适合留学生",
        features: [
          "包含基础版全部功能",
          "优先住房推荐",
          "专属城市指南",
          "邮件支持",
          "提前获取新内容",
        ],
        cta: "立即购买",
        href: null,
        highlighted: true,
      },
      {
        name: "专业版",
        price: "₹999",
        amount: 999,
        priceNote: "每年",
        badge: null,
        description: "适合住房顾问和中介",
        features: [
          "包含高级版全部功能",
          "管理后台访问权限",
          "创建和发布博客",
          "数据分析仪表板",
          "专属客服支持",
        ],
        cta: "立即购买",
        href: null,
        highlighted: false,
      },
    ],
  },
};

type Props = { lang: string };

export default function PricingClient({ lang }: Props) {
  const language = lang === "zh" ? "zh" : "en";
  const t = PRICING_TEXT[language];
  const plans = t.plans;

  return (
    <div>
      {/* Header */}
      <div className="bg-navy py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-amber text-sm font-semibold uppercase tracking-wider mb-3">
            {t.badge}
          </p>
          <h1
            className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            {t.title}
          </h1>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col relative ${
                plan.highlighted
                  ? "bg-navy text-white shadow-2xl shadow-navy/30 ring-2 ring-amber"
                  : "bg-white text-gray-800 border border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-amber text-navy text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                  {plan.name}
                </h2>
                <p className={`mt-1 text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="ml-2 text-sm text-gray-400">{plan.priceNote}</span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 text-base ${plan.highlighted ? "text-amber" : "text-navy"}`}>✓</span>
                    <span className={plan.highlighted ? "text-gray-200" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.href ? (
                <Link
                  href={plan.href}
                  className={`w-full text-center py-3.5 rounded-xl font-bold transition ${
                    plan.highlighted
                      ? "bg-amber hover:bg-amber-dark text-navy"
                      : "bg-gray-100 hover:bg-gray-200 text-navy"
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handlePayment(plan.amount, plan.name)}
                  className={`w-full py-3.5 rounded-xl font-bold transition cursor-pointer ${
                    plan.highlighted
                      ? "bg-amber hover:bg-amber-dark text-navy"
                      : "bg-navy hover:bg-navy-light text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>{t.secure}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🧪</span>
            <span>{t.testMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>{t.support}</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2
            className="text-3xl font-bold text-navy text-center mb-10"
            style={{ fontFamily: "Playfair Display, Georgia, serif" }}
          >
            {t.faqTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.faqs.map((item) => (
              <div key={item.q} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-navy mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
