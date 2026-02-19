import Link from "next/link";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";

export default async function MedicinesList({ searchParams }) {
  const { q, filter } = await searchParams;

  const allMedicines = await db.select().from(medicines).orderBy(medicines.name);

  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  function isExpiringSoon(expiry) {
    if (!expiry) return false;
    const parts = expiry.split("/");
    if (parts.length < 2) return false;
    const expDate = new Date(`${parts[1]}-${parts[0]}-01`);
    return expDate <= threeMonthsLater && expDate >= today;
  }

  function isExpired(expiry) {
    if (!expiry) return false;
    const parts = expiry.split("/");
    if (parts.length < 2) return false;
    const expDate = new Date(`${parts[1]}-${parts[0]}-01`);
    return expDate < today;
  }

  let filtered = allMedicines;

  if (filter === "expiring") {
    filtered = allMedicines.filter((m) => isExpiringSoon(m.expiry));
  } else if (filter === "expired") {
    filtered = allMedicines.filter((m) => isExpired(m.expiry));
  } else if (filter === "lowstock") {
    filtered = allMedicines.filter((m) => m.stock <= 10);
  } else if (q) {
    filtered = allMedicines.filter((m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      (m.company && m.company.toLowerCase().includes(q.toLowerCase()))
    );
  }

  const expiringCount = allMedicines.filter((m) => isExpiringSoon(m.expiry)).length;
  const expiredCount = allMedicines.filter((m) => isExpired(m.expiry)).length;
  const lowStockCount = allMedicines.filter((m) => m.stock <= 10).length;

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

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Link href="/medicines?filter=lowstock">
            <div className={`rounded-xl p-3 text-center ${filter === "lowstock" ? "bg-orange-500 text-white" : "bg-orange-50"}`}>
              <p className="text-lg font-bold text-orange-600">{lowStockCount}</p>
              <p className="text-xs text-orange-500">Low Stock</p>
            </div>
          </Link>
          <Link href="/medicines?filter=expiring">
            <div className={`rounded-xl p-3 text-center ${filter === "expiring" ? "bg-yellow-500 text-white" : "bg-yellow-50"}`}>
              <p className="text-lg font-bold text-yellow-600">{expiringCount}</p>
              <p className="text-xs text-yellow-500">Expiring Soon</p>
            </div>
          </Link>
          <Link href="/medicines?filter=expired">
            <div className={`rounded-xl p-3 text-center ${filter === "expired" ? "bg-red-500 text-white" : "bg-red-50"}`}>
              <p className="text-lg font-bold text-red-600">{expiredCount}</p>
              <p className="text-xs text-red-500">Expired</p>
            </div>
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
          {filtered.map((m) => {
            const expiring = isExpiringSoon(m.expiry);
            const expired = isExpired(m.expiry);
            return (
              <Link key={m.id} href={`/medicines/${m.id}`}>
                <div className={`bg-white rounded-2xl shadow p-4 border-l-4 ${expired ? "border-red-500" : expiring ? "border-yellow-400" : m.stock <= 10 ? "border-orange-400" : "border-transparent"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{m.name}</p>
                      <p className="text-sm text-gray-400">{m.company}</p>
                      <p className="text-xs text-gray-400">Batch: {m.batch} | Expiry: {m.expiry}</p>
                      {expired && <p className="text-xs text-red-500 font-semibold">EXPIRED</p>}
                      {expiring && !expired && <p className="text-xs text-yellow-500 font-semibold">Expiring Soon</p>}
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
            );
          })}

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No medicines found</p>
          )}
        </div>
      </div>
    </main>
  );
}