"use client";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/", icon: "🏠", label: "Dashboard" },
  { href: "/sales/new", icon: "🧾", label: "New Bill" },
  { href: "/sales", icon: "📋", label: "All Bills" },
  { href: "/patients", icon: "👤", label: "Patients" },
  { href: "/medicines", icon: "💊", label: "Medicines" },
  { href: "/suppliers", icon: "🏭", label: "Suppliers" },
  { href: "/purchases/new", icon: "📦", label: "New Purchase" },
  { href: "/report", icon: "📊", label: "Report" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bottom Bar - सिर्फ Menu button */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-700 text-white z-20 flex justify-center items-center h-16 no-print">
        <button onClick={() => setOpen(true)} className="flex flex-col items-center text-sm font-semibold">
          <span className="text-2xl">☰</span>
          <span>Menu</span>
        </button>
      </nav>

      {/* Drawer Overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex flex-col justify-end no-print">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setOpen(false)} />
          <div className="relative bg-blue-700 text-white rounded-t-3xl p-5 space-y-1">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Akhil Medical</h2>
              <button onClick={() => setOpen(false)} className="text-2xl">✕</button>
            </div>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <div className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-blue-600 transition">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}