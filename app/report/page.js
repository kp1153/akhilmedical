import { db } from "@/lib/db";
import { patients, payments, sales, saleItems } from "@/lib/schema";
import Link from "next/link";

export default async function Report({ searchParams }) {
  const { month, year } = await searchParams;

  const now = new Date();
  const selectedMonth = month ? Number(month) : now.getMonth() + 1;
  const selectedYear = year ? Number(year) : now.getFullYear();

  const allPatients = await db.select().from(patients);
  const allSales = await db.select().from(sales);
  const allPayments = await db.select().from(payments);
  const allSaleItems = await db.select().from(saleItems);

  const monthSales = allSales.filter(s => {
    const d = new Date(s.createdAt);
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  });

  const monthSaleIds = new Set(monthSales.map(s => s.id));
  const monthSaleItems = allSaleItems.filter(i => monthSaleIds.has(i.saleId));

  const totalSales = monthSales.reduce((sum, s) => sum + s.netAmount, 0);
  const cashSales = monthSales.filter(s => s.paymentType !== 'udhaar').reduce((sum, s) => sum + s.netAmount, 0);
  const udhaarSales = monthSales.filter(s => s.paymentType === 'udhaar').reduce((sum, s) => sum + s.netAmount, 0);

  const medicineMap = {};
  monthSaleItems.forEach(item => {
    if (!medicineMap[item.medicineName]) medicineMap[item.medicineName] = 0;
    medicineMap[item.medicineName] += item.quantity;
  });
  const top10 = Object.entries(medicineMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const results = allPatients.map((patient) => {
    const patientSales = allSales.filter(s => s.patientId === patient.id);
    const patientPayments = allPayments.filter(p => p.patientId === patient.id);

    const monthPatientSales = patientSales.filter(s => {
      const d = new Date(s.createdAt);
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });
    const monthPatientPayments = patientPayments.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });

    const udhaar = monthPatientSales.filter(s => s.paymentType === 'udhaar').reduce((sum, s) => sum + s.netAmount, 0);
    const paid = monthPatientPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalUdhaar = patientSales.filter(s => s.paymentType === 'udhaar').reduce((sum, s) => sum + s.netAmount, 0);
    const totalPaid = patientPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalBaki = totalUdhaar - totalPaid;

    return { patient, udhaar, paid, totalBaki };
  });

  const filtered = results.filter(r => r.udhaar > 0 || r.paid > 0);
  const totalUdhaarMonth = filtered.reduce((sum, r) => sum + r.udhaar, 0);
  const totalPaidMonth = filtered.reduce((sum, r) => sum + r.paid, 0);

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">

        <div className="md:hidden grid grid-cols-3 gap-3">
          <Link href="/patients">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">👤</span>
              <p className="text-xs text-gray-600 mt-1">Patients</p>
            </div>
          </Link>
          <Link href="/suppliers">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">🏭</span>
              <p className="text-xs text-gray-600 mt-1">Suppliers</p>
            </div>
          </Link>
          <Link href="/purchases/new">
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <span className="text-2xl">📦</span>
              <p className="text-xs text-gray-600 mt-1">Purchase</p>
            </div>
          </Link>
        </div>

        <h1 className="text-xl font-bold text-blue-700">Monthly Report</h1>

        <form method="GET" className="bg-white rounded-2xl shadow p-4 flex gap-3">
          <select name="month" defaultValue={selectedMonth} className="flex-1 border rounded-lg p-2">
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select name="year" defaultValue={selectedYear} className="flex-1 border rounded-lg p-2">
            {[2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 rounded-lg">Go</button>
        </form>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-500">Total Sales</p>
            <p className="text-lg font-bold text-blue-600">Rs. {totalSales.toFixed(0)}</p>
          </div>
          <div className="bg-green-50 rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-500">Cash</p>
            <p className="text-lg font-bold text-green-600">Rs. {cashSales.toFixed(0)}</p>
          </div>
          <div className="bg-red-50 rounded-2xl shadow p-4 text-center">
            <p className="text-xs text-gray-500">Udhaar</p>
            <p className="text-lg font-bold text-red-600">Rs. {udhaarSales.toFixed(0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-2xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Udhaar Given</p>
            <p className="text-2xl font-bold text-red-600">Rs. {totalUdhaarMonth.toFixed(0)}</p>
          </div>
          <div className="bg-green-50 rounded-2xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">Received</p>
            <p className="text-2xl font-bold text-green-600">Rs. {totalPaidMonth.toFixed(0)}</p>
          </div>
        </div>

        {top10.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="font-bold text-gray-700 mb-3">Top 10 Medicines</h2>
            <div className="space-y-2">
              {top10.map(([name, qty], i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-2">
                  <span className="text-gray-700">{i + 1}. {name}</span>
                  <span className="font-semibold text-blue-600">{qty} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <h2 className="font-bold text-gray-700">Patient wise</h2>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400">No transactions this month</p>
          )}
          {filtered.map(({ patient, udhaar, paid, totalBaki }) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-800">{patient.name}</p>
                  <p className={`font-bold ${totalBaki > 0 ? "text-red-500" : "text-green-500"}`}>
                    Rs. {totalBaki.toFixed(0)}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Udhaar: Rs. {udhaar.toFixed(0)}</span>
                  <span>Paid: Rs. {paid.toFixed(0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}