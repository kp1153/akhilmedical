import Link from "next/link";
import { db } from "@/lib/db";
import { payments, sales, medicines } from "@/lib/schema";
import { sql } from "drizzle-orm";

export default async function Home() {
  const allSales = await db.select().from(sales);
  const allMedicines = await db.select().from(medicines);

  const totalPending = allSales
    .filter((s) => s.paymentType === "udhaar")
    .reduce((sum, s) => sum + s.netAmount, 0);

  const lowStockCount = allMedicines.filter((m) => m.stock <= 10).length;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Akhil Medical
      </h1>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm">Udhaar Pending</p>
            <p className="text-2xl font-bold text-red-600 mt-1">Rs. {totalPending.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">{lowStockCount} items</p>
          </div>
        </div>

        <Link href="/sales/new">
          <div className="bg-blue-600 text-white rounded-2xl shadow p-4 text-center font-semibold text-lg">
            + New Bill
          </div>
        </Link>

        <Link href="/sales">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            All Bills
          </div>
        </Link>

        <Link href="/patients">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            Patients & Udhaar
          </div>
        </Link>

        <Link href="/medicines">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            Medicines & Stock
          </div>
        </Link>

        <Link href="/suppliers">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            Suppliers
          </div>
        </Link>

        <Link href="/report">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            Monthly Report
          </div>
        </Link>
      </div>
    </main>
  );
}