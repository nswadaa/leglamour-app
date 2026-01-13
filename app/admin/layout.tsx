"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard admin", href: "/admin" },
    { label: "Customers", href: "/admin/customers" },
    { label: "Kelola Jadwal", href: "/admin/jadwal" },
    { label: "Kelola Appointment", href: "/admin/appointment" },
    { label: "Laporan", href: "/admin/laporan" },
    { label: "Review", href: "/admin/review" },
    { label: "Kelola Admin", href: "/admin/kelola-admin" },
    { label: "Treatment", href: "/admin/treatment" }, 
  ];

  const currentTitle =
    menu.find((m) => m.href === pathname)?.label || "Dashboard admin";

  return (
    <div className="flex h-screen bg-[#f7f7f7] overflow-hidden font-serif">
      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 h-full w-64 bg-[#d8c6b5] transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center ml-7 mt-6 mb-10">
          <Image src="/logo.png" alt="Logo" width={120} height={120} />
        </div>

        <nav className="space-y-2 px-4 text-sm">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2 transition
                ${
                  pathname === item.href
                    ? "bg-[#cbb8a6] font-semibold"
                    : "hover:bg-[#cbb8a6]"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
            <Image src="/logout.png" alt="Logout" width={18} height={18} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}

      {/* MAIN */}
      <main className="flex-1 w-full relative z-10">
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="text-2xl font-bold">
              ☰
            </button>
            <span className="font-semibold text-lg">{currentTitle}</span>
          </div>

          <input
            placeholder="Search here"
            className="border rounded-full px-4 py-2 text-sm w-[280px]"
          />

          <div className="flex items-center gap-3">
            <Image
              src="/logo1.png"
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-medium">Admin</span>
          </div>
        </header>

        <div className="h-[calc(100vh-72px)] overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
