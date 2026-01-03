"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [leftOpen, setLeftOpen] = useState(true);
  const router = useRouter();

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
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-serif">
      <div className="max-w-[1440px] mx-auto flex min-h-screen">

        {/* LEFT SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#D0BDAC] p-6 flex flex-col">
            <Image
              src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
              alt="Logo"
              width={120}
              height={120}
              className="mb-10"
            />

            <nav className="flex flex-col gap-4 text-[20px]">
              {[
                { label: "Dashboard admin", path: "/admin" },
                { label: "Customers", path: "/admin/customers" },
                { label: "Kelola Jadwal", path: "/admin/jadwal" },
                { label: "Kelola Appointment", path: "/admin/appointment" },
                { label: "Kelola Transaksi", path: "/admin/transaksi" },
                { label: "Laporan", path: "/admin/laporan" },
                { label: "Review", path: "/admin/review", active: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    item.active
                      ? "bg-white"
                      : "hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-10">
              <button className="flex items-center gap-2 text-[18px]">
                ⎋ Logout
              </button>
            </div>
          </aside>
        )}

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white shadow flex items-center px-8">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className="text-[26px] mr-4"
            >
              ☰
            </button>

            <h1 className="text-[22px] mr-6">Review</h1>

            <div className="flex-1 flex justify-center">
              <input
                className="w-[300px] h-[40px] border rounded-full px-4"
                placeholder="Search here"
              />
            </div>

            <div className="flex items-center gap-2">
              <span>Admin</span>
              <Image
                src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-8">
            <div className="bg-white rounded-[30px] shadow border p-8 h-full">

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
                  <div className="font-medium">{item.nama}</div>

                  <div>
                    {editingId === item.id ? (
                      <textarea
                        value={editedReview}
                        onChange={(e) => setEditedReview(e.target.value)}
                        className="w-full border rounded-lg p-2 text-[14px]"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-600">{item.review}</p>
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
          </main>
        </div>
      </div>
    </div>
  );
}
