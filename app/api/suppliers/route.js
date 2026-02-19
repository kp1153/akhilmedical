import { db } from "@/lib/db";
import { suppliers } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(suppliers).orderBy(suppliers.name);
  return NextResponse.json(all);
}

export async function POST(request) {
  const body = await request.json();
  await db.insert(suppliers).values({
    name: body.name,
    mobile: body.mobile,
    address: body.address,
    gstin: body.gstin,
  });
  return NextResponse.json({ success: true });
}