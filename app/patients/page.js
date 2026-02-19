import Link from "next/link";
import { db } from "@/lib/db";
import { patients, transactions, payments } from "@/lib/schema";
import { sql } from "drizzle-orm";

export default async function PatientsList({ searchParams }) {
  const { q } = await searchParams;

  const allPatients = await db.select().from(patients).orderBy(patients.name);

  const filtered = q
    ? allPatients.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.mobile && p.mobile.includes(q))
      )
    : allPatients;

  const balances = await db
    .select({
      patientId: transactions.patientId,
      totalUdhari: sql`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .groupBy(transactions.patientId);

  const paid = await db
    .select({
      patientId: payments.patientId,
      totalPaid: sql`COALESCE(SUM(${payments.amount}), 0)`,
    })
    .from(payments)
    .groupBy(payments.patientId);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-700">All Patients</h1>
          <Link href="/patients/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + Add New
            </button>
          </Link>
        </div>

        <form method="GET" className="mb-4">
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search by name or mobile..."
            className="w-full border rounded-lg p-3 bg-white shadow-sm"
          />
        </form>

        <div className="space-y-3">
          {filtered.map((patient) => {
            const udhari = Number(balances.find((b) => b.patientId === patient.id)?.totalUdhari || 0);
            const payment = Number(paid.find((p) => p.patientId === patient.id)?.totalPaid || 0);
            const baki = udhari - payment;

            return (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-400">{patient.mobile || "No mobile"}</p>
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

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No patients found</p>
          )}
        </div>
      </div>
    </main>
  );
}