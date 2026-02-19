import { db } from "@/lib/db";
import { payments } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.delete(payments).where(eq(payments.id, Number(id)));
  return NextResponse.json({ success: true });
}