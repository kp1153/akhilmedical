import { db } from "@/lib/db";
import { purchases, purchaseItems, medicines } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(purchases);
  return NextResponse.json(all);
}

export async function POST(request) {
  const body = await request.json();

  const inserted = await db.insert(purchases).values({
    supplierId: body.supplierId,
    billNumber: body.billNumber,
    paymentType: body.paymentType,
    totalAmount: body.totalAmount,
    paidAmount: body.paidAmount,
  }).returning();

  const purchaseId = inserted[0].id;

  for (const item of body.items) {
    if (!item.medicineName) continue;
    await db.insert(purchaseItems).values({
      purchaseId,
      medicineId: item.medicineId || null,
      medicineName: item.medicineName,
      hsnCode: item.hsnCode || null,
      batch: item.batch || null,
      expiry: item.expiry || null,
      quantity: item.quantity,
      freeQty: item.freeQty || 0,
      rate: item.rate,
      mrp: item.mrp || 0,
      discount: item.discount,
      sgst: item.sgst,
      cgst: item.cgst,
      amount: item.amount,
    });

    if (item.medicineId) {
      const totalQty = Number(item.quantity) + Number(item.freeQty || 0);
      await db.update(medicines)
        .set({
          stock: sql`stock + ${totalQty}`,
          batch: item.batch || null,
          expiry: item.expiry || null,
        })
        .where(eq(medicines.id, item.medicineId));
    }
  }

  return NextResponse.json({ success: true });
}