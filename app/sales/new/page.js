 "use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewSale() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);
  const [paymentType, setPaymentType] = useState("cash");
  const [items, setItems] = useState([
    { medicineId: "", medicineName: "", quantity: 1, rate: 0, discount: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetch("/api/medicines").then((r) => r.json()).then(setMedicines);
    fetch("/api/patients").then((r) => r.json()).then(setPatients);
  }, []);

  function handleMedicineSelect(index, medicineId) {
    const med = medicines.find((m) => m.id === Number(medicineId));
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      medicineId: med ? med.id : "",
      medicineName: med ? med.name : "",
      rate: med ? med.salePrice : 0,
      amount: med ? med.salePrice * updated[index].quantity : 0,
    };
    setItems(updated);
  }

  function handleItemChange(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    const rate = Number(updated[index].rate);
    const qty = Number(updated[index].quantity);
    const disc = Number(updated[index].discount);
    updated[index].amount = rate * qty - (rate * qty * disc) / 100;
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { medicineId: "", medicineName: "", quantity: 1, rate: 0, discount: 0, amount: 0 }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  const totalAmount = items.reduce((sum, i) => sum + Number(i.amount), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/sales", {
      method: "POST",
      body: JSON.stringify({
        patientId: formData.get("patientId") ? Number(formData.get("patientId")) : null,
        paymentType,
        items,
        totalAmount,
        netAmount: totalAmount,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push("/sales");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">New Bill</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-600">Customer (optional)</label>
            <select name="patientId" className="w-full border rounded-lg p-2 mt-1">
              <option value="">-- Walk-in Customer --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} | {p.mobile}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Payment Type</label>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full border rounded-lg p-2 mt-1">
              <option value="cash">Cash</option>
              <option value="upi">UPI / PhonePe</option>
              <option value="udhaar">Udhaar</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <h2 className="font-semibold text-gray-700">Items</h2>
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-2">
              <select onChange={(e) => handleMedicineSelect(index, e.target.value)} className="w-full border rounded-lg p-2">
                <option value="">-- Select Medicine --</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} | Stock: {m.stock}</option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Qty</label>
                  <input type="number" min={1} value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Rate</label>
                  <input type="number" value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Disc %</label>
                  <input type="number" min={0} max={100} value={item.discount}
                    onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                    className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-green-600">Rs. {Number(item.amount).toFixed(2)}</p>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-red-400 text-sm">Remove</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem} className="w-full border-2 border-dashed border-blue-300 text-blue-500 rounded-lg p-2">
            + Add Item
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
          <p className="font-bold text-gray-700">Total</p>
          <p className="text-2xl font-bold text-blue-700">Rs. {totalAmount.toFixed(2)}</p>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Generate Bill"}
        </button>
      </form>
    </main>
  );
}