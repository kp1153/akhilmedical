import { db } from "@/lib/db";
import { sales, saleItems, patients } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import PrintButton from "./PrintButton";

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

  const isWholesale = s.billType === "wholesale";

  const sgstTotal = items.reduce((sum, i) => sum + Number(i.sgstAmount || 0), 0);
  const cgstTotal = items.reduce((sum, i) => sum + Number(i.cgstAmount || 0), 0);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">

        <div className="flex justify-between items-center no-print">
          <Link href="/sales" className="text-blue-600 text-sm">Back</Link>
          <PrintButton />
        </div>

        <div id="print-area" className="bg-white shadow p-6 space-y-4">

         <div className="text-center border-b pb-3">
  <h1 className="text-2xl font-bold">Akhil Medical Store</h1>
  <p className="text-sm text-gray-600">Hathiyawa Chauraha, Siddharth Nagar - 272189, Uttar Pradesh</p>
  <p className="text-sm text-gray-600">Phone: 8400017027 | Email: akhileshyadav72513@gmail.com</p>
  <p className="text-sm text-gray-600">Web: akhilmedical.store</p>
  <p className="text-xs text-gray-500">GSTIN: XXXXXXXXXXXX (Placeholder)</p>
  {isWholesale && <p className="text-sm font-semibold text-blue-600 mt-1">GST INVOICE</p>}
  <p className="text-xs text-gray-400 mt-1">All disputes subject to Siddharth Nagar jurisdiction only.</p>
</div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Bill No.</p>
              <p className="font-semibold">{s.billNumber}</p>
              <p className="text-gray-500 mt-1">Bill Type</p>
              <p className="font-semibold">{s.billType?.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Date</p>
              <p className="font-semibold">{new Date(s.createdAt).toLocaleString("en-IN")}</p>
              <p className="text-gray-500 mt-1">Payment</p>
              <p className="font-semibold">{s.paymentType?.toUpperCase()}</p>
            </div>
          </div>

          <div className="text-sm border-t pt-2">
            <p className="text-gray-500">Customer</p>
            <p className="font-semibold">{patient ? patient.name : "Walk-in Customer"}</p>
            {patient?.mobile && <p className="text-gray-400">{patient.mobile}</p>}
            {patient?.address && <p className="text-gray-400">{patient.address}</p>}
          </div>

          {isWholesale ? (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="border p-1 text-left">Item</th>
                  <th className="border p-1">HSN</th>
                  <th className="border p-1">Batch</th>
                  <th className="border p-1">Exp</th>
                  <th className="border p-1">Qty</th>
                  <th className="border p-1">Free</th>
                  <th className="border p-1">Rate</th>
                  <th className="border p-1">MRP</th>
                  <th className="border p-1">Disc%</th>
                  <th className="border p-1">SGST%</th>
                  <th className="border p-1">CGST%</th>
                  <th className="border p-1 text-right">Amt</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border p-1">{item.medicineName}</td>
                    <td className="border p-1 text-center">{item.hsnCode || "-"}</td>
                    <td className="border p-1 text-center">{item.batch || "-"}</td>
                    <td className="border p-1 text-center">{item.expiry || "-"}</td>
                    <td className="border p-1 text-center">{item.quantity}</td>
                    <td className="border p-1 text-center">{item.freeQty || 0}</td>
                    <td className="border p-1 text-center">{item.rate}</td>
                    <td className="border p-1 text-center">{item.mrp || "-"}</td>
                    <td className="border p-1 text-center">{item.discount}%</td>
                    <td className="border p-1 text-center">{item.sgst}%</td>
                    <td className="border p-1 text-center">{item.cgst}%</td>
                    <td className="border p-1 text-right">Rs. {Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-center py-1">Rate</th>
                  <th className="text-center py-1">Disc%</th>
                  <th className="text-right py-1">Amt</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-1">{item.medicineName}</td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-center py-1">{item.rate}</td>
                    <td className="text-center py-1">{item.discount}%</td>
                    <td className="text-right py-1">Rs. {Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="border-t pt-3 space-y-1 text-sm">
            {isWholesale && (
              <>
                <div className="flex justify-between text-gray-500">
                  <p>SGST</p>
                  <p>Rs. {sgstTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-gray-500">
                  <p>CGST</p>
                  <p>Rs. {cgstTotal.toFixed(2)}</p>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <p>Grand Total</p>
              <p>Rs. {s.netAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 border-t pt-3">
            <p>Thank you for your purchase!</p>           
          </div>

        </div>

        {patient && (
          <Link href={`/patients/${s.patientId}`} className="no-print block">
            <div className="bg-gray-100 text-gray-700 rounded-2xl p-4 text-center font-semibold">
              View Patient Account
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}