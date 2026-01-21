"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Treatment = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  duration: number;
  isActive: number;
};

type Category = {
  id: number;
  name: string;
};

export default function TreatmentPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>("all");

  const [treatments, setTreatments] = useState<Treatment[]>([]);

  /* ================= FETCH FROM DB ================= */
  const fetchTreatments = async (cat: string = category) => {
    const url =
      cat === "all"
        ? "/api/services"
        : `/api/services?category=${encodeURIComponent(cat)}`;

    const res = await fetch(url);
    const data = await res.json();
    setTreatments(data);
  };

  const toggleStatus = async (item: Treatment) => {
    const newStatus = item.isActive === 1 ? 0 : 1;

    // Optimistic UI
    setTreatments((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, isActive: newStatus } : t)),
    );

    await fetch(`/api/services/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_active: newStatus,
      }),
    });
  };

  useEffect(() => {
    fetch("/api/service-categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    fetchTreatments();
  }, [category]);

  /* ================= CATEGORY LABEL ================= */
  const categoryLabel = (id: number) => {
    if (id === 1) return "Nail Art";
    if (id === 2) return "Eyelash";
    return "-";
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="font-semibold text-lg">Treatment</h1>

        <div className="flex gap-3 items-center">
          {/* FILTER KATEGORI */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">Semua</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* ADD BUTTON */}
          <Link
            href="/admin/treatment/add"
            className="bg-black text-white px-5 py-2 rounded-full text-sm text-center"
          >
            + Add Treatment
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm text-center">
          <thead>
            <tr className="border-b">
              <th className="py-3">No</th>
              <th className="py-3">Nama</th>
              <th className="py-3">Kategori</th>
              <th className="py-3">Harga</th>
              <th className="py-3">Durasi</th>
              <th className="py-3">Status</th>
              <th className="py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {treatments.map((item, index) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="py-4">{index + 1}</td>

                <td className="py-4">{item.name}</td>

                <td className="py-4">{categoryLabel(item.categoryId)}</td>

                <td className="py-4">
                  Rp {item.price.toLocaleString("id-ID")}
                </td>

                <td className="py-4">{item.duration} menit</td>

                {/* STATUS (BELUM ADA DI DB → DUMMY) */}
                <td className="py-4">
                  <div
                    className="inline-flex cursor-pointer"
                    onClick={() => toggleStatus(item)}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer pointer-events-none"
                      checked={item.isActive === 1}
                      readOnly
                    />

                    <div
                      className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-black relative
    after:absolute after:top-[2px] after:left-[2px]
    after:bg-white after:h-4 after:w-4 after:rounded-full
    after:transition peer-checked:after:translate-x-4"
                    />
                  </div>
                </td>

                <td className="py-4">
                  <Link
                    href={`/admin/treatment/edit/${item.id}`}
                    className="bg-gray-200 px-4 py-1 rounded-full text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}

            {treatments.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-gray-500">
                  Data treatment kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
