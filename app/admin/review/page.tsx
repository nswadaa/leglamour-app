"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  name: string;
};

type Review = {
  id: number;
  nama: string;
  review: string;
};

export default function ReviewPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      nama: "Aulia Putri",
      review: "Pelayanan sangat ramah dan hasil nail art rapi banget 💅",
    },
    {
      id: 2,
      nama: "Nabila Zahra",
      review: "Tempatnya nyaman, bersih, dan hasilnya sesuai request.",
    },
    {
      id: 3,
      nama: "Salsa Maharani",
      review: "Ownernya baik, pengerjaan cepat tapi tetap detail.",
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedReview, setEditedReview] = useState("");

  /* ================= AUTH ================= */
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

  /* ================= ACTIONS ================= */
  const handleDelete = (id: number) => {
    if (!confirm("Yakin mau hapus review ini?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEdit = (item: Review) => {
    setEditingId(item.id);
    setEditedReview(item.review);
  };

  const handleSave = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, review: editedReview } : r
      )
    );
    setEditingId(null);
    setEditedReview("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedReview("");
  };

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
        Review
      </h1>

      {/* ===== REVIEW TABLE ===== */}
      <div className="bg-white rounded-[30px] shadow border p-8">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-[1.5fr_3fr_1.5fr] items-center border-b pb-4 mb-6 text-[18px] font-semibold">
          <div>Nama</div>
          <div>Review</div>
          <div className="text-right">Aksi</div>
        </div>

        {/* TABLE ROWS */}
        {reviews.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1.5fr_3fr_1.5fr] items-center py-4 border-b text-[16px]"
          >
            <div className="font-medium">
              {item.nama}
            </div>

            <div>
              {editingId === item.id ? (
                <textarea
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                  className="w-full border rounded-lg p-2 text-[14px]"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">
                  {item.review}
                </p>
              )}
            </div>

            <div className="text-right space-x-2">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => handleSave(item.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Tidak ada review
          </div>
        )}
      </div>
    </section>
  );
}
