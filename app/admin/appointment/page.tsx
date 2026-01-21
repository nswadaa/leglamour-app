"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  name: string;
};

type Appointment = {
  id: number;
  nama: string;
  phone: string;
  handle: string;
  service: string;
  tanggal: string;
  jam: string;
  status: string;
  bukti: string | null;
};

export default function AppointmentPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      nama: "Ayu",
      phone: "628123456789",
      handle: "Owner",
      service: "Basic Gel Polish ~ 2 hrs",
      tanggal: "2025-12-28",
      jam: "10:00",
      status: "Menunggu",
      bukti: null,
    },
    {
      id: 2,
      nama: "Bella",
      phone: "628987654321",
      handle: "Senior",
      service: "Nail Art Luxury ~ 3 hrs",
      tanggal: "2025-12-29",
      jam: "13:30",
      status: "Menunggu",
      bukti: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      nama: "Nia",
      phone: "628112233445",
      handle: "Junior",
      service: "Manicure ~ 1.5 hrs",
      tanggal: "2025-12-30",
      jam: "17:00",
      status: "Menunggu",
      bukti: "https://via.placeholder.com/200",
    },
  ]);

  const [handleFilter, setHandleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin", { cache: "no-store" });
      if (res.status === 401) return router.push("/auth/login");
      const data = await res.json();
      setAdmin(data.user ?? null);
    };
    load();
  }, [router]);

  if (admin === "loading") {
    return (
      <div className="h-full flex items-center justify-center">Loading…</div>
    );
  }

  const filteredAppointments = appointments
    .filter((a) => !handleFilter || a.handle === handleFilter)
    .filter((a) => !typeFilter || a.type === typeFilter);

  const handleApprove = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Disetujui" } : a))
    );
  };

  const handleReject = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Ditolak" } : a))
    );
  };

  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <section className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[28px] font-semibold">Daftar Appointment</h2>

        <button
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          onClick={() => {
            setHandleFilter("");
            setTypeFilter("");
          }}
        >
          Reset Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-3xl shadow overflow-hidden">
          <thead className="bg-[#F9F9F9] text-sm font-semibold">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">No. HP</th>
              <th className="px-6 py-4">
                <select
                  className="border rounded-lg px-2 py-1"
                  value={handleFilter}
                  onChange={(e) => setHandleFilter(e.target.value)}
                >
                  <option value="">Handles By</option>
                  <option value="Owner">Owner</option>
                  <option value="Senior">Senior</option>
                  <option value="Junior">Junior</option>
                </select>
              </th>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Jam</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Bukti</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {filteredAppointments.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{a.nama}</td>

                {/* PHONE + WHATSAPP */}
                <td className="px-6 py-3">
                  <a
                    href={`https://wa.me/${a.phone}?text=Halo%20${a.nama},%20kami%20dari%20admin%20Le%20Glamour%20ingin%20konfirmasi%20appointment%20kamu.`}
                    target="_blank"
                    className="text-green-600 underline text-sm"
                  >
                    {a.phone}
                  </a>
                </td>

                <td className="px-6 py-3">{a.handle}</td>
                <td className="px-6 py-3">{a.type}</td>
                <td className="px-6 py-3">{a.service}</td>
                <td className="px-6 py-3">{a.tanggal}</td>
                <td className="px-6 py-3">{a.jam}</td>

                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      a.status === "Menunggu"
                        ? "bg-yellow-500"
                        : a.status === "Disetujui"
                        ? "bg-green-500"
                        : "bg-red-600"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                <td className="px-6 py-3">
                  {a.bukti ? (
                    <button className="text-blue-600 underline">
                      Lihat Gambar
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Belum upload</span>
                  )}
                </td>

                <td className="px-6 py-3 flex gap-2">
                  {a.status === "Ditolak" ? (
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs"
                    >
                      Hapus
                    </button>
                  ) : a.status === "Disetujui" ? null : (
                    <>
                      <button
                        onClick={() => handleApprove(a.id)}
                        className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
