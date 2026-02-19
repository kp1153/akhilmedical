 import { db } from "@/lib/db";
import { patients, transactions, payments } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function Report({ searchParams }) {
  const { month, year } = await searchParams;

  const now = new Date();
  const selectedMonth = month ? Number(month) : now.getMonth() + 1;
  const selectedYear = year ? Number(year) : now.getFullYear();

  const allPatients = await db.select().from(patients);

  const results = await Promise.all(
    allPatients.map(async (patient) => {
      const txns = await db
        .select()
        .from(transactions)
        .where(eq(transactions.patientId, patient.id));

      const pmts = await db
        .select()
        .from(payments)
        .where(eq(payments.patientId, patient.id));

      const monthTxns = txns.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      });

      const monthPmts = pmts.filter((p) => {
        const d = new Date(p.createdAt);
        return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
      });

      const udhari = monthTxns.reduce((sum, t) => sum + t.amount, 0);
      const paid = monthPmts.reduce((sum, p) => sum + p.amount, 0);

      const totalUdhari = txns.reduce((sum, t) => sum + t.amount, 0);
      const totalPaid = pmts.reduce((sum, p) => sum + p.amount, 0);
      const totalBaki = totalUdhari - totalPaid;

      return { patient, udhari, paid, totalBaki };
    })
  );

  const filtered = results.filter((r) => r.udhari > 0 || r.paid > 0);

  const totalUdhariMonth = filtered.reduce((sum, r) => sum + r.udhari, 0);
  const totalPaidMonth = filtered.reduce((sum, r) => sum + r.paid, 0);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/" className="text-blue-600 text-sm">Back</Link>
        <h1 className="text-xl font-bold text-blue-700">Monthly Report</h1>

        <form method="GET" className="bg-white rounded-2xl shadow p-4 flex gap-3">
          <select name="month" defaultValue={selectedMonth} className="flex-1 border rounded-lg p-2">
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select name="year" defaultValue={selectedYear} className="flex-1 border rounded-lg p-2">
            {[2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 rounded-lg">Go</button>
        </form>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-2xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Udhari</p>
            <p className="text-2xl font-bold text-red-600">Rs. {totalUdhariMonth.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 rounded-2xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Total Received</p>
            <p className="text-2xl font-bold text-green-600">Rs. {totalPaidMonth.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400">No transactions this month</p>
          )}
          {filtered.map(({ patient, udhari, paid, totalBaki }) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className={`font-bold ${totalBaki > 0 ? "text-red-500" : "text-green-500"}`}>
                    Rs. {totalBaki.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Udhari: Rs. {udhari.toFixed(2)}</span>
                  <span>Paid: Rs. {paid.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}