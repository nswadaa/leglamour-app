"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: string;
};

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomers, setNewCustomers] = useState<Customer[]>([]);
  const [leftOpen, setLeftOpen] = useState(true);

  const loadData = async () => {
    const res = await fetch("/api/admin/customers", { cache: "no-store" });
    const data = await res.json();
    setCustomers(data.customers);
    setNewCustomers(data.newCustomers);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteCustomer = async (id: number) => {
    if (!confirm("Hapus akun customer ini?")) return;
    await fetch("/api/admin/customers", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-serif">
      <div className="max-w-[1440px] mx-auto flex min-h-screen">
        {/* LEFT SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#D0BDAC] p-6 min-h-screen flex flex-col">
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
                { label: "Kelola Appoitment", path: "/admin/appointment" },
                { label: "Laporan", path: "/admin/laporan" },
                { label: "Review", path: "/admin/review" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    item.path === "/admin/customers"
                      ? "bg-white"
                      : "hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 transition text-[20px]">
                ↩ Logout
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

            <h1 className="text-[22px] font-semibold mr-6">Customers</h1>

            <div className="flex-1 flex justify-center">
              <div className="relative w-[320px]">
                <input
                  className="w-full h-[44px] border border-gray-300 rounded-full px-6 pr-12"
                  placeholder="Search here"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                  🔍
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Image
                src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium">Admin</span>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-8 overflow-auto">
            {/* NEW CUSTOMER */}
            <h2 className="text-[28px] font-semibold mb-6">New Customers</h2>
            <div className="bg-white rounded-3xl shadow-md p-8 mb-10">
              <div className="flex gap-6 flex-wrap">
                {newCustomers.map((c, idx) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 border-2 border-gray-300 rounded-full px-6 py-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <span className="text-[16px] font-medium">
                      {idx + 1} | {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ALL CUSTOMER TABLE */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden">
              <div className="flex px-8 py-5 border-b">
                <div className="flex-1 text-[18px] font-medium">Name</div>
                <div className="flex-1 text-[18px] font-medium">Phone</div>
                <div className="w-[100px] text-[18px] font-medium">Aksi</div>
              </div>

              {customers.map((c) => (
                <div
                  key={c.id}
                  className="flex px-8 py-5 border-b border-gray-100 items-center"
                >
                  <div className="flex-1 text-[16px]">{c.name}</div>
                  {/* PHONE + WHATSAPP */}
                  <div className="flex-1 text-[16px]">
                    {c.phone ? (
                      <a
                        href={`https://wa.me/${
                          c.phone.startsWith("62")
                            ? c.phone
                            : "62" + c.phone.slice(1)
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-medium"
                      >
                        {c.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No phone</span>
                    )}
                  </div>
                  <div className="w-[100px]">
                    <button
                      onClick={() => deleteCustomer(c.id)}
                      className="bg-red-600 text-white px-6 py-2 rounded-full text-[14px] font-medium hover:bg-red-700 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
