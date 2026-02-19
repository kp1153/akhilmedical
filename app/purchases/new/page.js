"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NewPurchaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplierId");

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [paymentType, setPaymentType] = useState("credit");
  const [items, setItems] = useState([
    { medicineId: "", medicineName: "", hsnCode: "", batch: "", expiry: "", quantity: 1, freeQty: 0, rate: 0, mrp: 0, discount: 0, sgst: 0, cgst: 0, amount: 0 },
  ]);

  useEffect(() => {
    fetch("/api/medicines").then((r) => r.json()).then(setMedicines);
    fetch("/api/suppliers").then((r) => r.json()).then(setSuppliers);
  }, []);

  function calculateAmount(item) {
    const rate = Number(item.rate);
    const qty = Number(item.quantity);
    const disc = Number(item.discount);
    const baseAmount = rate * qty;
    const discAmount = (baseAmount * disc) / 100;
    const amount = baseAmount - discAmount;
    return { ...item, amount };
  }

  function handleMedicineSelect(index, medicineId) {
    const med = medicines.find((m) => m.id === Number(medicineId));
    const updated = [...items];
    updated[index] = calculateAmount({
      ...updated[index],
      medicineId: med ? med.id : "",
      medicineName: med ? med.name : "",
      hsnCode: med ? med.hsnCode : "",
      batch: med ? med.batch : "",
      expiry: med ? med.expiry : "",
      rate: med ? med.purchasePrice : 0,
      mrp: med ? med.mrp : 0,
      sgst: med ? med.sgst : 0,
      cgst: med ? med.cgst : 0,
    });
    setItems(updated);
  }

  function handleItemChange(index, field, value) {
    const updated = [...items];
    updated[index] = calculateAmount({ ...updated[index], [field]: value });
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { medicineId: "", medicineName: "", hsnCode: "", batch: "", expiry: "", quantity: 1, freeQty: 0, rate: 0, mrp: 0, discount: 0, sgst: 0, cgst: 0, amount: 0 }]);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  const totalAmount = items.reduce((sum, i) => sum + Number(i.amount), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    await fetch("/api/purchases", {
      method: "POST",
      body: JSON.stringify({
        supplierId: Number(formData.get("supplierId")),
        billNumber: formData.get("billNumber"),
        paymentType,
        items,
        totalAmount,
        paidAmount: paymentType === "cash" ? totalAmount : 0,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    router.push(`/suppliers/${formData.get("supplierId")}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-bold text-blue-700 mb-6">New Purchase</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">
          <div>
            <label className="text-sm text-gray-600">Supplier *</label>
            <select name="supplierId" defaultValue={supplierId || ""} required className="w-full border rounded-lg p-2 mt-1">
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Supplier Bill No.</label>
            <input name="billNumber" placeholder="e.g. A009592" className="w-full border rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Payment Type</label>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full border rounded-lg p-2 mt-1">
              <option value="cash">Cash</option>
              <option value="upi">UPI / PhonePe</option>
              <option value="credit">Credit (Udhaar)</option>
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Batch</label>
                  <input value={item.batch} onChange={(e) => handleItemChange(index, "batch", e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Expiry</label>
                  <input value={item.expiry} placeholder="06/2026" onChange={(e) => handleItemChange(index, "expiry", e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Qty</label>
                  <input type="number" min={1} value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Free</label>
                  <input type="number" min={0} value={item.freeQty} onChange={(e) => handleItemChange(index, "freeQty", e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Rate</label>
                  <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, "rate", e.target.value)} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Disc %</label>
                  <input type="number" min={0} max={100} value={item.discount} onChange={(e) => handleItemChange(index, "discount", e.target.value)} className="w-full border rounded-lg p-2" />
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

        <div className="bg-white rounded-2xl shadow p-4 flex justify-between font-bold text-lg">
          <p>Total</p>
          <p className="text-blue-700">Rs. {totalAmount.toFixed(2)}</p>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold">
          {loading ? "Saving..." : "Save Purchase"}
        </button>
      </form>
    </main>
  );
}

export default function NewPurchase() {
  return (
    <Suspense fallback={<p className="p-4 text-gray-400">Loading...</p>}>
      <NewPurchaseForm />
    </Suspense>
  );
}