import { db } from '@/lib/db'
import { saleItems, medicines, sales } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') // format: 2025-01

  const items = await db
    .select({
      saleId: saleItems.saleId,
      quantity: saleItems.quantity,
      amount: saleItems.amount,
      purchasePrice: medicines.purchasePrice,
      createdAt: sales.createdAt,
    })
    .from(saleItems)
    .leftJoin(medicines, eq(saleItems.medicineId, medicines.id))
    .leftJoin(sales, eq(saleItems.saleId, sales.id))

  const filtered = month
    ? items.filter(i => i.createdAt?.startsWith(month))
    : items

  let revenue = 0, cost = 0
  for (const item of filtered) {
    revenue += item.amount || 0
    cost += (item.purchasePrice || 0) * (item.quantity || 0)
  }

  return NextResponse.json({
    revenue: Math.round(revenue * 100) / 100,
    cost: Math.round(cost * 100) / 100,
    profit: Math.round((revenue - cost) * 100) / 100,
  })
}