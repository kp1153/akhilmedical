import { db } from "@/lib/db";
import { saleItems } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await db.insert(saleItems).values({
    medicineName: body.description || "Manual Entry",
    quantity: body.quantity || 1,
    rate: body.amount,
    amount: body.amount,
    saleId: null,
  });
  return NextResponse.json({ success: true });
}