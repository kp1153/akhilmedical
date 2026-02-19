import Link from "next/link";
import { db } from "@/lib/db";
import { payments, transactions } from "@/lib/schema";
import { sql } from "drizzle-orm";

export default async function Home() {
  const totalUdhari = await db
    .select({ total: sql`COALESCE(SUM(amount), 0)` })
    .from(transactions);

  const totalPayments = await db
    .select({ total: sql`COALESCE(SUM(amount), 0)` })
    .from(payments);

  const baki =
    Number(totalUdhari[0].total) - Number(totalPayments[0].total);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Akhil Medical
      </h1>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">Total Pending</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            Rs. {baki.toFixed(2)}
          </p>
        </div>

        <Link href="/patients/new">
          <div className="bg-blue-600 text-white rounded-2xl shadow p-4 text-center font-semibold text-lg">
            + Add New Patient
          </div>
        </Link>

        <Link href="/patients">
          <div className="bg-white rounded-2xl shadow p-4 text-center font-semibold text-gray-700">
            View All Patients
          </div>
        </Link>
      </div>
    </main>
  );
}