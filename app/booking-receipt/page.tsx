"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingReceipt() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("payment-data");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <p className="text-gray-500">Tidak ada data pembayaran.</p>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Halo Admin, saya ingin konfirmasi pembayaran booking.\n\n` +
      `SERVICE: ${data.service}\n` +
      `STAFF: ${data.staff}\n` +
      `TANGGAL: ${data.date}\n` +
      `WAKTU: ${data.time}\n` +
      `DP: Rp ${data.dp.toLocaleString("id-ID")}\n\n` +
      `Mohon untuk dicek dan dikunci jadwalnya.`
  );

  const whatsappLink = `https://wa.me/6287765221804?text=${whatsappMessage}`;

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-8 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
        Booking Payment Receipt
      </h2>

      <div className="bg-white shadow-md rounded-2xl p-6 max-w-xl mx-auto">
        {/* INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <InfoItem label="Service" value={data.service} />
          <InfoItem label="Staff" value={data.staff} />
          <InfoItem label="Tanggal" value={data.date} />
          <InfoItem label="Waktu" value={data.time} />
        </div>

        {/* DP */}
        <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-6 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Total DP
          </span>
          <span className="text-lg font-semibold text-gray-900">
            Rp {data.dp.toLocaleString("id-ID")}
          </span>
        </div>

        {/* BUKTI PEMBAYARAN */}
        <div className="mb-8">
          <p className="text-xs text-gray-500 mb-2">
            Bukti Pembayaran
          </p>
          <div className="border rounded-xl p-3 bg-gray-50">
            <img
              src={data.preview}
              className="w-full max-h-72 object-contain rounded-lg"
              alt="bukti pembayaran"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            className="w-full bg-black text-white text-center py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
          >
            Konfirmasi ke Admin (WhatsApp)
          </a>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full border border-gray-300 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
