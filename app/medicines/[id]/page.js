import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function MedicineDetail({ params }) {
  const { id } = await params;
  const medicine = await db.select().from(medicines).where(eq(medicines.id, Number(id)));
  const m = medicine[0];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/medicines" className="text-blue-600 text-sm">Back</Link>

        <div className="bg-white rounded-2xl shadow p-5 space-y-2">
          <h1 className="text-xl font-bold text-gray-800">{m.name}</h1>
          <p className="text-gray-500 text-sm">Company: {m.company || "N/A"}</p>
          <p className="text-gray-500 text-sm">Batch: {m.batch || "N/A"}</p>
          <p className="text-gray-500 text-sm">Expiry: {m.expiry || "N/A"}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">MRP</p>
            <p className="text-lg font-bold text-gray-700">Rs. {m.mrp}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">Purchase</p>
            <p className="text-lg font-bold text-gray-700">Rs. {m.purchasePrice}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">Sale</p>
            <p className="text-lg font-bold text-gray-700">Rs. {m.salePrice}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">Current Stock</p>
          <p className={`text-4xl font-bold mt-1 ${m.stock <= 10 ? "text-red-600" : "text-green-600"}`}>
            {m.stock} units
          </p>
          {m.stock <= 10 && (
            <p className="text-red-400 text-sm mt-1">Low Stock Alert!</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/medicines/${id}/add-stock`}>
            <div className="bg-blue-600 text-white rounded-2xl p-4 text-center font-semibold">
              + Add Stock
            </div>
          </Link>
          <Link href={`/medicines/${id}/edit`}>
            <div className="bg-gray-200 text-gray-700 rounded-2xl p-4 text-center font-semibold">
              Edit Details
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}