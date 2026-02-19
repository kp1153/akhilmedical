import { db } from "@/lib/db";
import { transactions } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await db.insert(transactions).values({
    patientId: body.patientId,
    amount: body.amount,
    description: body.description,
  });
  return NextResponse.json({ success: true });
}