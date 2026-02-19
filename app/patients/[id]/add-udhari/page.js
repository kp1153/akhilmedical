"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUdhari({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number(id),
        amount: Number(formData.get("amount")),
        description: formData.get("description"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push(`/patients/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-red-600 mb-6">Add Udhari</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Amount (Rs.) *</label>
          <input name="amount" type="number" required className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <input name="description" placeholder="Medicine name etc." className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-red-500 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Add Udhari"}
        </button>
      </form>
    </main>
  );
}