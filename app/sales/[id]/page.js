import { db } from "@/lib/db";
import { sales, saleItems, patients } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function SaleDetail({ params }) {
  const { id } = await params;
  const saleId = Number(id);

  const sale = await db.select().from(sales).where(eq(sales.id, saleId));
  const items = await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));

  const s = sale[0];
  let patient = null;
  if (s.patientId) {
    const p = await db.select().from(patients).where(eq(patients.id, s.patientId));
    patient = p[0];
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/sales" className="text-blue-600 text-sm">Back</Link>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{s.billNumber}</h1>
              <p className="text-sm text-gray-400">{new Date(s.createdAt).toLocaleString("en-IN")}</p>
            </div>
            <p className={`text-sm font-bold px-3 py-1 rounded-full ${s.paymentType === "udhaar" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
              {s.paymentType.toUpperCase()}
            </p>
          </div>
          {patient && (
            <p className="text-gray-600 mt-2">Customer: <span className="font-semibold">{patient.name}</span></p>
          )}
          {!patient && <p className="text-gray-400 mt-2">Walk-in Customer</p>}
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Items</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                <div>
                  <p className="font-semibold text-gray-700">{item.medicineName}</p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} x Rs. {item.rate}
                    {item.discount > 0 && ` | Disc: ${item.discount}%`}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">Rs. {item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
            <p>Total</p>
            <p className="text-blue-700">Rs. {s.netAmount.toFixed(2)}</p>
          </div>
        </div>

        {patient && (
          <Link href={`/patients/${s.patientId}`}>
            <div className="bg-gray-100 text-gray-700 rounded-2xl p-4 text-center font-semibold">
              View Patient Account
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}