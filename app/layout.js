import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Akhil Medical",
  description: "Medical Store Management Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">

          {/* Sidebar - Desktop */}
          <aside className="hidden md:flex flex-col w-56 bg-blue-700 text-white fixed h-full z-10">
            <div className="p-5 border-b border-blue-600">
              <h1 className="text-xl font-bold">Akhil Medical</h1>
              <p className="text-xs text-blue-200 mt-1">akhilmedical.store</p>
            </div>
            <nav className="flex flex-col gap-1 p-3 flex-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>🏠</span><span>Dashboard</span>
              </Link>
              <Link href="/sales/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition bg-blue-500">
                <span>🧾</span><span>New Bill</span>
              </Link>
              <Link href="/sales" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>📋</span><span>All Bills</span>
              </Link>
              <Link href="/patients" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>👤</span><span>Patients</span>
              </Link>
              <Link href="/medicines" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>💊</span><span>Medicines</span>
              </Link>
              <Link href="/suppliers" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>🏭</span><span>Suppliers</span>
              </Link>
              <Link href="/purchases/new" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>📦</span><span>New Purchase</span>
              </Link>
              <Link href="/report" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                <span>📊</span><span>Report</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-56 pb-20 md:pb-0">
            {children}
          </main>

          {/* Bottom Nav - Mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-10 flex justify-around items-center h-16 no-print">
            <Link href="/" className="flex flex-col items-center text-xs text-gray-500">
              <span className="text-xl">🏠</span>
              <span>Home</span>
            </Link>
            <Link href="/sales/new" className="flex flex-col items-center text-xs text-blue-600 font-semibold">
              <span className="text-xl">🧾</span>
              <span>Bill</span>
            </Link>
            <Link href="/medicines" className="flex flex-col items-center text-xs text-gray-500">
              <span className="text-xl">💊</span>
              <span>Medicines</span>
            </Link>
            <Link href="/sales" className="flex flex-col items-center text-xs text-gray-500">
              <span className="text-xl">📋</span>
              <span>Bills</span>
            </Link>
            <Link href="/report" className="flex flex-col items-center text-xs text-gray-500">
              <span className="text-xl">☰</span>
              <span>More</span>
            </Link>
          </nav>

        </div>
      </body>
    </html>
  );
}