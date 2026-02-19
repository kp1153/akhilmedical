import { db } from "@/lib/db";
import { patients } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  await db.insert(patients).values({
    name: body.name,
    mobile: body.mobile,
    address: body.address,
  });
  return NextResponse.json({ success: true });
}