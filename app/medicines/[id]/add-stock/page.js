"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStock({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch(`/api/medicines/${id}/add-stock`, {
      method: "POST",
      body: JSON.stringify({
        quantity: Number(formData.get("quantity")),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push(`/medicines/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">Add Stock</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Quantity to Add *</label>
          <input name="quantity" type="number" required className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Add Stock"}
        </button>
      </form>
    </main>
  );
}