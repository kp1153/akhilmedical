import Link from "next/link";
import { db } from "@/lib/db";
import { suppliers, purchases } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export default async function SuppliersList() {
  const allSuppliers = await db.select().from(suppliers).orderBy(suppliers.name);

  const purchaseTotals = await db
    .select({
      supplierId: purchases.supplierId,
      total: sql`COALESCE(SUM(${purchases.totalAmount}), 0)`,
      paid: sql`COALESCE(SUM(${purchases.paidAmount}), 0)`,
    })
    .from(purchases)
    .groupBy(purchases.supplierId);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-700">Suppliers</h1>
          <Link href="/suppliers/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + Add New
            </button>
          </Link>
        </div>

        <div className="space-y-3">
          {allSuppliers.map((supplier) => {
            const pt = purchaseTotals.find((p) => p.supplierId === supplier.id);
            const baki = pt ? Number(pt.total) - Number(pt.paid) : 0;
            return (
              <Link key={supplier.id} href={`/suppliers/${supplier.id}`}>
                <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{supplier.name}</p>
                    <p className="text-sm text-gray-400">{supplier.mobile}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${baki > 0 ? "text-red-500" : "text-green-500"}`}>
                      Rs. {baki.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">pending</p>
                  </div>
                </div>
              </Link>
            );
          })}
          {allSuppliers.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No suppliers yet</p>
          )}
        </div>
      </div>
    </main>
  );
}