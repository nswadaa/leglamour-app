"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  name: string;
};

type Review = {
  id: number;
  name: string;
  review: string;
  isVisible: boolean;
};

export default function ReviewPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [reviews, setReviews] = useState<Review[]>([]);

  /* ================= AUTH ================= */
  useEffect(() => {
    const loadAdmin = async () => {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (res.status === 401) return router.push("/auth/login");
      if (res.status === 403) return router.push("/dashboard");

      const data = await res.json();
      setAdmin(data.user ?? null);
    };

    loadAdmin();
  }, [router]);

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    const loadReviews = async () => {
      const res = await fetch("/api/admin/reviews", { cache: "no-store" });
      if (!res.ok) return;

      const data = await res.json();
      setReviews(data);
    };

    loadReviews();
  }, []);

  /* ================= TOGGLE ================= */
  const toggleVisibility = async (id: number) => {
    await fetch(`/api/reviews/${id}/visibility`, {
      method: "PATCH",
    });

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVisible: !r.isVisible } : r)),
    );
  };

  if (admin === "loading") {
    return (
      <div className="h-full flex items-center justify-center">Loading…</div>
    );
  }

  return (
    <section className="p-8 font-serif">
      <h1 className="text-[28px] font-semibold mb-6">Review</h1>

      <div className="bg-white rounded-[30px] shadow border p-8">
        <div className="grid grid-cols-[1.5fr_3fr_1.5fr] items-center border-b pb-4 mb-6 text-[18px] font-semibold">
          <div>Nama</div>
          <div>Review</div>
          <div className="text-right">Status</div>
        </div>

        {reviews.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1.5fr_3fr_1.5fr] items-center py-4 border-b text-[16px]"
          >
            <div className="font-medium">{item.name}</div>

            <p className="text-gray-600">{item.review}</p>

            <div className="text-right">
              <button
                onClick={() => toggleVisibility(item.id)}
                className={`px-4 py-2 rounded-full text-white transition ${
                  item.isVisible
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {item.isVisible ? "Ditampilkan" : "Disembunyikan"}
              </button>
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
