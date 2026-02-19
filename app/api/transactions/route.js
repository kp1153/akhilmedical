import { db } from "@/lib/db";
import { transactions, medicines } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await db.insert(transactions).values({
    patientId: body.patientId,
    medicineId: body.medicineId || null,
    amount: body.amount,
    quantity: body.quantity || 1,
    description: body.description,
  });

  if (body.medicineId) {
    await db
      .update(medicines)
      .set({ stock: sql`stock - ${body.quantity}` })
      .where(eq(medicines.id, body.medicineId));
  }

  return NextResponse.json({ success: true });
}