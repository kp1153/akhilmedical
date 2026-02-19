"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSupplier() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/suppliers", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        mobile: formData.get("mobile"),
        address: formData.get("address"),
        gstin: formData.get("gstin"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push("/suppliers");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">Add New Supplier</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Supplier Name *</label>
          <input name="name" required className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Mobile</label>
          <input name="mobile" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Address</label>
          <input name="address" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">GSTIN</label>
          <input name="gstin" className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Save Supplier"}
        </button>
      </form>
    </main>
  );
}