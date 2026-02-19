import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(medicines).orderBy(medicines.name);
  return NextResponse.json(all);
}

export async function POST(request) {
  const body = await request.json();
  await db.insert(medicines).values({
    name: body.name,
    company: body.company,
    batch: body.batch,
    expiry: body.expiry,
    mrp: body.mrp,
    purchasePrice: body.purchasePrice,
    salePrice: body.salePrice,
    stock: body.stock,
    hsnCode: body.hsnCode,
    sgst: body.sgst,
    cgst: body.cgst,
  });
  return NextResponse.json({ success: true });
}