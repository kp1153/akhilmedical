"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddTransaction({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch("/api/medicines").then((r) => r.json()).then(setMedicines);
  }, []);

  function handleMedicineChange(e) {
    const med = medicines.find((m) => m.id === Number(e.target.value));
    setSelectedMedicine(med || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const amount = selectedMedicine
      ? selectedMedicine.salePrice * quantity
      : Number(formData.get("amount"));
    await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number(id),
        medicineId: selectedMedicine ? selectedMedicine.id : null,
        amount,
        quantity: selectedMedicine ? quantity : 1,
        description: selectedMedicine ? selectedMedicine.name : formData.get("description"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push(`/patients/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-red-600 mb-6">Add Transaction</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl shadow p-5 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Select Medicine</label>
          <select onChange={handleMedicineChange} className="w-full border rounded-lg p-2 mt-1">
            <option value="">-- Manual Entry --</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} | Stock: {m.stock} | Rs. {m.salePrice}
              </option>
            ))}
          </select>
        </div>

        {selectedMedicine && (
          <div>
            <label className="text-sm text-gray-600">Quantity</label>
            <input
              type="number"
              min={1}
              max={selectedMedicine.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1"
            />
            <p className="text-sm text-green-600 mt-1">
              Total: Rs. {(selectedMedicine.salePrice * quantity).toFixed(2)}
            </p>
          </div>
        )}

        {!selectedMedicine && (
          <>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <input name="description" placeholder="Medicine name etc." className="w-full border rounded-lg p-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Amount (Rs.) *</label>
              <input name="amount" type="number" required className="w-full border rounded-lg p-2 mt-1" />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="w-full bg-red-500 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Add Transaction"}
        </button>
      </form>
    </main>
  );
}