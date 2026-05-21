import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file." },
        { status: 500 }
      );
    }

    const { amount = 499, currency = "INR" } = await req.json().catch(() => ({}));

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency,
      receipt: `rsc_${Date.now()}`,
      notes: { platform: "RoomScholars" },
    });

    return NextResponse.json(order);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
