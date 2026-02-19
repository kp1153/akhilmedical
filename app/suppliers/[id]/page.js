import { db } from "@/lib/db";
import { suppliers, purchases } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function SupplierDetail({ params }) {
  const { id } = await params;
  const supplierId = Number(id);

  const supplier = await db.select().from(suppliers).where(eq(suppliers.id, supplierId));
  const allPurchases = await db.select().from(purchases).where(eq(purchases.supplierId, supplierId));

  const totalPurchased = allPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = allPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const baki = totalPurchased - totalPaid;

  const s = supplier[0];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/suppliers" className="text-blue-600 text-sm">Back</Link>

        <div className="bg-white rounded-2xl shadow p-5">
          <h1 className="text-xl font-bold text-gray-800">{s.name}</h1>
          <p className="text-gray-400 text-sm">{s.mobile}</p>
          <p className="text-gray-400 text-sm">{s.address}</p>
          {s.gstin && <p className="text-gray-400 text-sm">GSTIN: {s.gstin}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">Total Purchased</p>
            <p className="text-lg font-bold text-gray-700">Rs. {totalPurchased.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">Total Paid</p>
            <p className="text-lg font-bold text-green-600">Rs. {totalPaid.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-400">Pending</p>
            <p className={`text-lg font-bold ${baki > 0 ? "text-red-600" : "text-green-600"}`}>Rs. {baki.toFixed(2)}</p>
          </div>
        </div>

        <Link href={`/purchases/new?supplierId=${supplierId}`}>
          <div className="bg-blue-600 text-white rounded-2xl p-4 text-center font-semibold">
            + New Purchase
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Purchase History</h2>
          <div className="space-y-2">
            {allPurchases.map((p) => (
              <Link key={p.id} href={`/purchases/${p.id}`}>
                <div className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <p className="font-semibold text-gray-700">{p.billNumber || "No Bill No."}</p>
                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">Rs. {p.totalAmount.toFixed(2)}</p>
                    <p className={`text-xs ${p.totalAmount - p.paidAmount > 0 ? "text-red-500" : "text-green-500"}`}>
                      {p.paymentType.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            {allPurchases.length === 0 && (
              <p className="text-center text-gray-400">No purchases yet</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}