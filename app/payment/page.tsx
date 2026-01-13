"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  const service = params.get("serviceId");
  const staff = params.get("staffId");
  const date = params.get("date");
  const time = params.get("time");

  const dp = 20000;

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("dp", String(dp));
    window.history.replaceState(null, "", url.toString());
  }, []);

  const onFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileData(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!fileData) {
      alert("Harap upload bukti pembayaran.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Bukti pembayaran berhasil dikirim (dummy).");
    }, 1000);
  };

  const InfoBox = ({
    label,
    value,
  }: {
    label: string;
    value: string | null;
  }) => (
    <div className="border rounded-xl p-4 text-sm bg-white">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-gray-700">{value || "-"}</p>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10 select-none">
      {/* BACK */}
      <span
        onClick={() => router.back()}
        className="cursor-pointer text-sm text-gray-600 hover:text-black"
      >
        ‹ Kembali
      </span>

      {/* TITLE */}
      <h2 className="text-xl sm:text-2xl font-semibold mt-2">
        PAYMENT FOR YOUR BOOK
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-6">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4 sm:p-6">
          {/* INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <InfoBox label="Service" value={service} />
            <InfoBox label="Staff" value={staff} />
            <InfoBox label="Tanggal" value={date} />
            <InfoBox label="Waktu" value={time} />
          </div>

          {/* DP */}
          <div className="border rounded-xl p-4 mb-4 flex justify-between items-center bg-gray-50 text-sm">
            <span className="font-semibold">Total DP</span>
            <span className="font-semibold">
              Rp {dp.toLocaleString("id-ID")}
            </span>
          </div>

          {/* UPLOAD */}
          <div className="border rounded-xl p-4 mb-4 text-center">
            <p className="text-xs mb-2 text-gray-500">
              Upload bukti pembayaran
            </p>

            <label className="cursor-pointer">
              <div className="w-full h-28 sm:h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                {uploadPreview ? (
                  <img
                    src={uploadPreview}
                    className="h-full max-h-28 sm:max-h-32 object-contain"
                  />
                ) : (
                  <img
                    src="/upload-icon.png"
                    className="w-8 opacity-40"
                  />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFilePick}
              />
            </label>
          </div>

          {/* DETAIL */}
          <div className="border rounded-xl p-4 text-sm text-gray-600">
            <p className="font-semibold text-black mb-1">Detail</p>
            Jika ada tambahan desain pada nails, maka akan dikenai biaya
            tambahan yang dibayar langsung di studio LeGlamour.
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full bg-[#8A4B20] text-white py-3 rounded-xl text-sm sm:text-base transition active:scale-[0.98]"
          >
            {loading ? "Mengirim..." : "KIRIM BUKTI PEMBAYARAN"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-start">
          <img
            src="/qris.png"
            alt="QRIS"
            className="w-64 sm:w-72 lg:w-[350px] rounded-xl shadow object-contain"
          />
        </div>
      </div>
    </div>
  );
}
