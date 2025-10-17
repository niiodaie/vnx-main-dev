"use client";
import { useState } from "react";

export default function UpgradeButton({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all"
    >
      {loading ? "Redirecting..." : "Upgrade to Pro"}
    </button>
  );
}
