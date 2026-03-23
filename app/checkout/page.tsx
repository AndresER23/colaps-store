import { CheckoutFlow } from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Checkout</h1>
        <CheckoutFlow />
      </div>
    </div>
  );
}
