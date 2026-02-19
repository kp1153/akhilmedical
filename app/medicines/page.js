import Link from "next/link";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";

export default async function MedicinesList({ searchParams }) {
  const { q } = await searchParams;

  const allMedicines = await db.select().from(medicines).orderBy(medicines.name);

  const filtered = q
    ? allMedicines.filter((m) =>
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        (m.company && m.company.toLowerCase().includes(q.toLowerCase()))
      )
    : allMedicines;

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-blue-700">Medicines</h1>
          <Link href="/medicines/new">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              + Add New
            </button>
          </Link>
        </div>

        <form method="GET" className="mb-4">
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search medicine or company..."
            className="w-full border rounded-lg p-3 bg-white shadow-sm"
          />
        </form>

        <div className="space-y-3">
          {filtered.map((m) => (
            <Link key={m.id} href={`/medicines/${m.id}`}>
              <div className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{m.name}</p>
                    <p className="text-sm text-gray-400">{m.company}</p>
                    <p className="text-xs text-gray-400">Batch: {m.batch} | Expiry: {m.expiry}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${m.stock <= 10 ? "text-red-500" : "text-green-600"}`}>
                      {m.stock} units
                    </p>
                    <p className="text-xs text-gray-400">MRP: Rs. {m.mrp}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No medicines found</p>
          )}
        </div>
      </div>
    </main>
  );
}