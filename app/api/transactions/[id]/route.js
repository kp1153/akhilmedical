import { db } from "@/lib/db";
import { transactions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.delete(transactions).where(eq(transactions.id, Number(id)));
  return NextResponse.json({ success: true });
}