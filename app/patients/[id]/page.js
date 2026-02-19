import { db } from "@/lib/db";
import { patients, payments } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export default async function PatientDetail({ params }) {
  const { id } = await params;
  const patientId = Number(id);

  const patient = await db.select().from(patients).where(eq(patients.id, patientId));
  const pmts = await db.select().from(payments).where(eq(payments.patientId, patientId));

  const totalPaid = pmts.reduce((sum, p) => sum + p.amount, 0);
  const baki = -totalPaid;

  const whatsappMessage = `Hello ${patient[0]?.name}, your pending amount at Akhil Medical is Rs. ${Math.abs(baki).toFixed(2)}. Please clear your dues. Thank you.`;
  const whatsappLink = `https://wa.me/91${patient[0]?.mobile}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Link href="/patients" className="text-blue-600 text-sm">Back</Link>

        <div className="bg-white rounded-2xl shadow p-5">
          <h1 className="text-xl font-bold text-gray-800">{patient[0]?.name}</h1>
          <p className="text-gray-400 text-sm">{patient[0]?.mobile}</p>
          <p className="text-gray-400 text-sm">{patient[0]?.address}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <p className="text-gray-500 text-sm">Total Pending</p>
          <p className={`text-3xl font-bold mt-1 ${baki > 0 ? "text-red-600" : "text-green-600"}`}>
            Rs. {Math.abs(baki).toFixed(2)}
          </p>
        </div>

        <Link href={`/patients/${id}/add-payment`}>
          <div className="bg-green-500 text-white rounded-2xl p-4 text-center font-semibold">
            + Add Payment
          </div>
        </Link>

        {patient[0]?.mobile && baki > 0 && (
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <div className="bg-[#25D366] text-white rounded-2xl p-4 text-center font-semibold">
              Send WhatsApp Reminder
            </div>
          </a>
        )}

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-bold text-gray-700 mb-3">Payment History</h2>
          <div className="space-y-2">
            {pmts.map((p) => (
              <div key={p.id} className="flex justify-between items-start text-sm border-b pb-2">
                <div>
                  <p className="text-gray-600">{p.method}</p>
                  <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 font-semibold">+ Rs. {p.amount}</span>
                  <DeleteButton id={p.id} type="payments" patientId={id} />
                </div>
              </div>
            ))}
            {pmts.length === 0 && (
              <p className="text-gray-400 text-center">No payments yet</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}