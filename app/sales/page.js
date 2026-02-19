import Link from "next/link";
import { db } from "@/lib/db";
import { sales, patients } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export default async function SalesList() {
  const allSales = await db.select().from(sales).orderBy(sql`${sales.createdAt} desc`);

  const allPatients = await db.select().from(patients);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-700">Bills</h1>
          <Link href="/sales/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + New Bill
            </button>
          </Link>
        </div>

        <div className="space-y-3">
          {allSales.map((sale) => {
            const patient = allPatients.find((p) => p.id === sale.patientId);
            return (
              <Link key={sale.id} href={`/sales/${sale.id}`}>
                <div className="bg-white rounded-2xl shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{sale.billNumber}</p>
                      <p className="text-sm text-gray-400">{patient ? patient.name : "Walk-in Customer"}</p>
                      <p className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-700">Rs. {sale.netAmount.toFixed(2)}</p>
                      <p className={`text-xs font-semibold ${sale.paymentType === "udhaar" ? "text-red-500" : "text-green-500"}`}>
                        {sale.paymentType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {allSales.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No bills yet</p>
          )}
        </div>
      </div>
    </main>
  );
}