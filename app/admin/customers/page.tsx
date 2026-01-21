"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomers, setNewCustomers] = useState<Customer[]>([]);

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
    <section className="p-8 font-serif">
      {/* ===== NEW CUSTOMERS ===== */}
      <h2 className="text-[28px] font-semibold mb-6">New Customers</h2>

      <div className="bg-white rounded-3xl shadow-md p-8 mb-10">
        <div className="flex gap-6 flex-wrap">
          {newCustomers.map((c, idx) => (
            <div
              key={c.id}
              className="flex items-center gap-3 border-2 border-gray-300 rounded-full px-6 py-3"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                👤
              </div>
              <span className="text-sm font-medium">
                {idx + 1} | {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ALL CUSTOMERS ===== */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="flex px-8 py-5 border-b font-medium">
          <div className="flex-1">Name</div>
          <div className="flex-1">Phone</div>
          <div className="w-[100px]">Aksi</div>
        </div>

        {customers.map((c) => (
          <div
            key={c.id}
            className="flex px-8 py-5 border-b border-gray-100 items-center"
          >
            <div className="flex-1">{c.name}</div>

            <div className="flex-1">
              {c.phone ? (
                <a
                  href={`https://wa.me/${
                    c.phone.startsWith("62") ? c.phone : "62" + c.phone.slice(1)
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
                className="bg-red-600 text-white px-6 py-2 rounded-full text-sm hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
