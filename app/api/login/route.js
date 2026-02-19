import { NextResponse } from 'next/server'

export async function POST(request) {
  const { password } = await request.json()

  if (password === process.env.SHOP_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth', process.env.SHOP_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
