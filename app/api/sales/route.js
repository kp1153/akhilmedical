import { db } from "@/lib/db";
import { sales, saleItems, medicines, payments } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(sales).orderBy(sql`${sales.createdAt} desc`);
  return NextResponse.json(all);
}

export async function POST(request) {
  const body = await request.json();
  const billNumber = "BILL-" + Date.now();

  const inserted = await db.insert(sales).values({
    billNumber,
    billType: body.billType,
    patientId: body.patientId || null,
    paymentType: body.paymentType,
    totalAmount: body.totalAmount,
    discountAmount: 0,
    sgstTotal: body.sgstTotal,
    cgstTotal: body.cgstTotal,
    netAmount: body.netAmount,
  }).returning();

  const saleId = inserted[0].id;

  for (const item of body.items) {
    if (!item.medicineName) continue;
    await db.insert(saleItems).values({
      saleId,
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
      sgstAmount: item.sgstAmount,
      cgstAmount: item.cgstAmount,
      amount: item.amount,
    });

    if (item.medicineId) {
      await db.update(medicines)
        .set({ stock: sql`stock - ${item.quantity}` })
        .where(eq(medicines.id, item.medicineId));
    }
  }

  if (body.paymentType === "udhaar" && body.patientId) {
    await db.insert(payments).values({
      patientId: body.patientId,
      amount: -body.netAmount,
      method: "udhaar",
    });
  }

  return NextResponse.json({ success: true, billNumber });
}