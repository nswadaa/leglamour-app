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
        <p>Tidak ada data pembayaran.</p>
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
  // GANTI nomor WA admin ↑↑↑

  return (
    <div className="w-full px-6 sm:px-12 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Booking Payment Receipt
      </h2>

      <div className="bg-white shadow rounded-2xl p-6 max-w-xl mx-auto">

        {/* SERVICE */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Service</p>
          <p className="text-lg font-medium">{data.service}</p>
        </div>

        {/* STAFF */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Staff</p>
          <p className="text-lg">{data.staff}</p>
        </div>

        {/* DATE */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Tanggal</p>
          <p className="text-lg">{data.date}</p>
        </div>

        {/* TIME */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">Waktu</p>
          <p className="text-lg">{data.time}</p>
        </div>

        {/* DP */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">DP</p>
          <p className="text-lg font-semibold">
            Rp {data.dp.toLocaleString("id-ID")}
          </p>
        </div>

        {/* PREVIEW IMAGE */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2">
            Bukti Pembayaran:
          </p>
          <img
            src={data.preview}
            className="w-full rounded-lg shadow object-contain"
            alt="bukti pembayaran"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col gap-3">

          <a
            href={whatsappLink}
            target="_blank"
            className="w-full bg-green-600 text-white text-center py-3 rounded-xl font-medium"
          >
            Kirim ke Admin via WhatsApp
          </a>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full border border-gray-300 py-3 rounded-xl"
          >
            Kembali ke Dashboard
          </button>

        </div>
      </div>
    </div>
  );
}
