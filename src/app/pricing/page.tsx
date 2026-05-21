import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — RoomScholars",
  description: "Choose a plan to unlock premium student housing content and exclusive city guides.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const language = lang === "zh" ? "zh" : "en";
  return <PricingClient lang={language} />;
}
