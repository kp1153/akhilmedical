import { db } from "@/lib/db";
import { purchases, suppliers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function PurchasesPage() {
  const allPurchases = await db.select().from(purchases);
  const allSuppliers = await db.select().from(suppliers);

  const supplierMap = {};
  allSuppliers.forEach(s => { supplierMap[s.id] = s.name });

  const sorted = allPurchases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Purchase History</h1>
          <Link href="/purchases/new" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm">
            + New Purchase
          </Link>
        </div>

        <div className="space-y-3">
          {sorted.map(p => {
            const baki = p.totalAmount - p.paidAmount
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{supplierMap[p.supplierId] || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">Bill: {p.billNumber || '-'}</p>
                    <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">Rs. {p.totalAmount?.toFixed(0)}</p>
                    <p className="text-xs text-green-600">Paid: Rs. {p.paidAmount?.toFixed(0)}</p>
                    {baki > 0 && <p className="text-xs text-red-500">Baki: Rs. {baki.toFixed(0)}</p>}
                  </div>
                </div>
              </div>
            )
          })}
          {sorted.length === 0 && (
            <p className="text-center text-gray-400">No purchases yet</p>
          )}
        </div>
      </div>
    </main>
  )
}