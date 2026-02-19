import Link from "next/link";
import { db } from "@/lib/db";
import { sales, medicines } from "@/lib/schema";

export default async function Home() {
  const allSales = await db.select().from(sales);
  const allMedicines = await db.select().from(medicines);

  const totalPending = allSales
    .filter((s) => s.paymentType === "udhaar")
    .reduce((sum, s) => sum + s.netAmount, 0);

  const lowStockCount = allMedicines.filter((m) => m.stock <= 10).length;
  const expiredCount = allMedicines.filter((m) => {
    if (!m.expiry) return false;
    const parts = m.expiry.split("/");
    if (parts.length < 2) return false;
    return new Date(`${parts[1]}-${parts[0]}-01`) < new Date();
  }).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        <div className="text-center pt-4 pb-2">
          <h1 className="text-2xl font-bold text-blue-700">Akhil Medical</h1>
          <p className="text-xs text-gray-400">akhilmedical.store</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">Rs. {totalPending.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">Udhaar Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{lowStockCount}</p>
            <p className="text-xs text-gray-500 mt-1">Low Stock</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-500">{expiredCount}</p>
            <p className="text-xs text-gray-500 mt-1">Expired</p>
          </div>
        </div>

        <Link href="/sales/new">
          <div className="bg-blue-600 text-white rounded-2xl shadow p-5 text-center font-bold text-xl">
            🧾 New Bill
          </div>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/sales">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">📋</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">All Bills</p>
            </div>
          </Link>
          <Link href="/patients">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">👤</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">Patients</p>
            </div>
          </Link>
          <Link href="/medicines">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">💊</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">Medicines</p>
            </div>
          </Link>
          <Link href="/suppliers">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">🏭</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">Suppliers</p>
            </div>
          </Link>
          <Link href="/purchases/new">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">📦</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">New Purchase</p>
            </div>
          </Link>
          <Link href="/report">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">📊</span>
              <p className="text-sm font-semibold text-gray-700 mt-1">Report</p>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}