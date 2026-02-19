import { db } from "@/lib/db";
import { payments } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await db.insert(payments).values({
    patientId: body.patientId,
    amount: body.amount,
    method: body.method,
  });
  return NextResponse.json({ success: true });
}