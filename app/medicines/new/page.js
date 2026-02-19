"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMedicine() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/medicines", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        company: formData.get("company"),
        batch: formData.get("batch"),
        expiry: formData.get("expiry"),
        mrp: Number(formData.get("mrp")),
        purchasePrice: Number(formData.get("purchasePrice")),
        salePrice: Number(formData.get("salePrice")),
        stock: Number(formData.get("stock")),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push("/medicines");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">Add New Medicine</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Medicine Name *</label>
          <input name="name" required className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Company</label>
          <input name="company" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Batch No.</label>
          <input name="batch" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Expiry (MM/YYYY)</label>
          <input name="expiry" placeholder="06/2026" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-sm text-gray-600">MRP</label>
            <input name="mrp" type="number" step="0.01" className="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Purchase</label>
            <input name="purchasePrice" type="number" step="0.01" className="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Sale Price</label>
            <input name="salePrice" type="number" step="0.01" className="w-full border rounded-lg p-2 mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Opening Stock</label>
          <input name="stock" type="number" defaultValue={0} className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Save Medicine"}
        </button>
      </form>
    </main>
  );
}