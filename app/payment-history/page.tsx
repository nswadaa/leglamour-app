"use client";

import Image from "next/image";
import Link from "next/link";

const payments = [
  {
    id: 1,
    date: "12 Jan 2026",
    service: "Nail Art Gel",
    staff: "Nina",
    amount: "Rp 120.000",
    status: "Paid",
  },
  {
    id: 2,
    date: "05 Jan 2026",
    service: "Eyelash Extension",
    staff: "Ayu",
    amount: "Rp 180.000",
    status: "Paid",
  },
  {
    id: 3,
    date: "28 Des 2025",
    service: "Nail Care",
    staff: "Salsa",
    amount: "Rp 90.000",
    status: "Pending",
  },
];

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 sm:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#4e2d15]">
              Payment History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Riwayat pembayaran treatment kamu
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 border rounded-full text-sm text-[#4e2d15] hover:bg-[#f5eee9] transition"
          >
            ← Kembali
          </Link>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f8f6f4] text-[#4e2d15]">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium">
                      Tanggal
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Treatment
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Staff
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-[#fafafa] transition"
                    >
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6 py-4">{item.service}</td>
                      <td className="px-6 py-4">{item.staff}</td>
                      <td className="px-6 py-4 font-medium">
                        {item.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>

                        {item.status === "Pending" && (
                          <p className="text-[11px] text-gray-400 mt-1">
                            Menunggu konfirmasi admin
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="py-16 flex flex-col items-center text-center">
              <Image
                src="/empty.png"
                width={180}
                height={180}
                alt="empty"
              />
              <p className="mt-4 text-sm text-gray-500">
                Belum ada riwayat pembayaran
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
