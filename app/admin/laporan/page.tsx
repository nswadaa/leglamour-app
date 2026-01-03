"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminUser = {
  id: number;
  name: string;
};

export default function LaporanPage() {
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [leftOpen, setLeftOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (res.status === 401) return router.push("/auth/login");
      if (res.status === 403) return router.push("/dashboard");
      const data = await res.json();
      setAdmin(data.user ?? null);
    };
    load();
  }, [router]);

  if (admin === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-serif">
      <div className="max-w-[1440px] mx-auto flex min-h-screen">

        {/* LEFT SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#D0BDAC] p-6 flex flex-col">
            <Image
              src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-10"
            />

            <nav className="flex flex-col gap-4 text-[20px]">
              {[
                { label: "Dashboard admin", path: "/admin" },
                { label: "Customers", path: "/admin/customers" },
                { label: "Kelola Jadwal", path: "/admin/jadwal" },
                { label: "Kelola Appointment", path: "/admin/appointment" },
                { label: "Laporan", path: "/admin/laporan", active: true },
                { label: "Review", path: "/admin/review" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    item.active
                      ? "bg-white"
                      : "hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-10">
              <button className="flex items-center gap-2 text-[18px]">
                ⎋ Logout
              </button>
            </div>
          </aside>
        )}

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white shadow flex items-center px-8">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className="text-[26px] mr-4"
            >
              ☰
            </button>

            <h1 className="text-[22px] mr-6">Laporan</h1>

            <div className="flex-1 flex justify-center">
              <input
                className="w-[300px] h-[40px] border rounded-full px-4"
                placeholder="Search here"
              />
            </div>

            <div className="flex items-center gap-2">
              <span>Admin</span>
              <Image
                src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-8 overflow-auto">

            {/* CUSTOMERS LIST */}
            <div className="bg-white rounded-xl shadow border p-6 mb-8">
              <h2 className="text-[22px] mb-4">Customers</h2>

              <div className="grid grid-cols-[1fr_120px] font-semibold mb-3">
                <div>Name</div>
                <div className="text-center">Aksi</div>
              </div>

              {["Rania", "Dinda Naswa", "eka rara"].map((name) => (
                <div
                  key={name}
                  className="grid grid-cols-[1fr_120px] items-center mb-3 bg-[#FBF7F4] px-4 py-3 rounded-xl shadow-sm"
                >
                  <div>{name}</div>
                  <div className="flex justify-center">
                    <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LAPORAN TABLE */}
            <div className="bg-white rounded-xl shadow border p-6">

            {/* HEADER */}
            <div
                className="
                grid 
                grid-cols-[1.5fr_1.6fr_1.4fr_2.6fr_1.2fr_1fr_1.2fr]
                gap-6 
                mb-4 
                font-semibold 
                text-[15px] 
                items-center
                "
            >
                <div>Name</div>

                <div className="flex items-center gap-3">
                <span className="whitespace-nowrap">Handles by</span>
                <select className="border rounded-full px-3 py-1 text-sm min-w-[110px]">
                    <option>All</option>
                    <option>Owner</option>
                    <option>Senior</option>
                    <option>Junior</option>
                </select>
                </div>

                <div className="flex items-center gap-3">
                <span>Type</span>
                <select className="border rounded-full px-3 py-1 text-sm min-w-[100px]">
                    <option>All</option>
                    <option>Natural</option>
                    <option>Medium</option>
                </select>
                </div>

                <div className="flex items-center gap-3">
                <span>Service</span>
                <select className="border rounded-full px-3 py-1 text-sm min-w-[170px]">
                    <option>All</option>
                    <option>Treatment Nails</option>
                    <option>Treatment Eyelash</option>
                </select>
                </div>

                <div className="whitespace-nowrap">Tanggal</div>
                <div>Jam</div>
                <div>Status</div>
            </div>

            {/* EMPTY STATE */}
            <div className="h-[240px] flex items-center justify-center text-gray-400">
                Belum ada data laporan
            </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
