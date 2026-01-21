"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTreatmentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Eyelash" | "Nail Art">("Nail Art");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const submitForm = async () => {
    if (!name || !price || !duration) return;

    // === MAP CATEGORY KE category_id ===
    const categoryId = category === "Nail Art" ? 1 : 2;

    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        categoryId,
        duration: Number(duration),
      }),
    });

    router.push("/admin/treatment");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 className="text-xl font-semibold mb-8">Add Treatment</h1>

      <div className="space-y-6">
        {/* NAMA */}
        <div>
          <label className="block text-sm mb-1">Nama Treatment</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
        </div>

        {/* KATEGORI */}
        <div>
          <label className="block text-sm mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "Eyelash" | "Nail Art")
            }
            className="w-full border-b border-gray-300 py-2"
          >
            <option value="Eyelash">Eyelash</option>
            <option value="Nail Art">Nail Art</option>
          </select>
        </div>

        {/* HARGA */}
        <div>
          <label className="block text-sm mb-1">Harga</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
        </div>

        {/* DURASI (BARU, WAJIB DB) */}
        <div>
          <label className="block text-sm mb-1">Durasi (menit)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-5 py-2 rounded-lg text-sm"
        >
          Batal
        </button>
        <button
          onClick={submitForm}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
