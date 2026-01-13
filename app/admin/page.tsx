"use client";

import Image from "next/image";
import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="p-6">
      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Customers", value: 40, icon: "/customers.png" },
          { title: "Kelola Appointment", value: 34, icon: "/appoitment.png" },
          { title: "Kelola Transaksi", value: 40, icon: "/payment.png" },
          {
            title: "Laporan",
            value: 34,
            icon: "/laporan.png",
            active: true,
          },
        ].map((c) => (
          <div
            key={c.title}
            className={`rounded-xl p-4 shadow ${
              c.active ? "bg-[#d8c6b5]" : "bg-white"
            }`}
          >
            <div className="text-lg font-semibold mb-2">{c.value}</div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{c.title}</span>
              <Image src={c.icon} alt={c.title} width={18} height={18} />
            </div>
          </div>
        ))}
      </div>

      {/* tabel + side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">
              Appointment hari ini (Senin, 17-November-2025)
            </h3>
            <Link href="/admin/appointment" className="text-sm text-[#b08968]">
              View All →
            </Link>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-[#d8c6b5]">
              <tr>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Treatment</th>
                <th className="p-2 text-left">Jam</th>
                <th className="p-2 text-left">Handle by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Belum ada appointment
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4 h-40">
            <h3 className="font-semibold mb-2">New Customers</h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4 h-40">
            <h3 className="font-semibold mb-2">New Review</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
