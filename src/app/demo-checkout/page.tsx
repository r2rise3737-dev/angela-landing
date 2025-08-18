import { Suspense } from "react";
import CheckoutClient from "./Client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DemoCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full" style={{ background: "#f8f5ef" }} />}>
      <CheckoutClient />
    </Suspense>
  );
}
