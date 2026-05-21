import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Razorpay HMAC-SHA256 signature verification
    // Spec: sign the string "order_id|payment_id" with the key secret
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Signature is valid — issue a short-lived signed token so the success
    // page can confirm the payment was genuine without re-verifying
    const token = crypto
      .createHmac("sha256", keySecret)
      .update(`verified|${razorpay_payment_id}|${Date.now()}`)
      .digest("hex")
      .slice(0, 32);

    return NextResponse.json({
      verified: true,
      payment_id: razorpay_payment_id,
      token,
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
