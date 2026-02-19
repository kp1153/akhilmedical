import { db } from "@/lib/db";
import { saleItems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.delete(saleItems).where(eq(saleItems.id, Number(id)));
  return NextResponse.json({ success: true });
}