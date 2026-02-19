import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;
  const medicine = await db.select().from(medicines).where(eq(medicines.id, Number(id)));
  return NextResponse.json(medicine[0]);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  await db
    .update(medicines)
    .set({
      name: body.name,
      company: body.company,
      batch: body.batch,
      expiry: body.expiry,
      mrp: body.mrp,
      purchasePrice: body.purchasePrice,
      salePrice: body.salePrice,
    })
    .where(eq(medicines.id, Number(id)));
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.delete(medicines).where(eq(medicines.id, Number(id)));
  return NextResponse.json({ success: true });
}