"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPayment({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number(id),
        amount: Number(formData.get("amount")),
        method: formData.get("method"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push(`/patients/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-green-600 mb-6">Add Payment</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Amount (Rs.) *</label>
          <input name="amount" type="number" required className="w-full border rounded-lg p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Payment Method</label>
          <select name="method" className="w-full border rounded-lg p-2 mt-1">
            <option value="cash">Cash</option>
            <option value="upi">UPI / PhonePe</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Add Payment"}
        </button>
      </form>
    </main>
  );
}