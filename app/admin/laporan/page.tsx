"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  name: string;
};

export default function LaporanPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");

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
      <div className="h-full flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <section className="p-8 font-serif">

      {/* ===== TITLE ===== */}
      <h1 className="text-[28px] font-semibold mb-6">
        Laporan
      </h1>

      {/* ===== CUSTOMERS LIST ===== */}
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

      {/* ===== LAPORAN TABLE ===== */}
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

    </section>
  );
}
