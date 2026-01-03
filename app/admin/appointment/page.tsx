"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminUser = {
  id: number;
  name: string;
};

type Appointment = {
  id: number;
  nama: string;
  handle: string;
  type: string;
  service: string;
  tanggal: string;
  jam: string;
  status: string; // Menunggu, Disetujui, Ditolak
  bukti: string | null;
};

export default function AppointmentPage() {
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [leftOpen, setLeftOpen] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      nama: "Ayu",
      handle: "Owner",
      type: "Medium",
      service: "Basic Gel Polish ~ 2 hrs",
      tanggal: "2025-12-28",
      jam: "10:00",
      status: "Menunggu",
      bukti: null,
    },
    {
      id: 2,
      nama: "Bella",
      handle: "Senior",
      type: "Natural",
      service: "Nail Art Luxury ~ 3 hrs",
      tanggal: "2025-12-29",
      jam: "13:30",
      status: "Menunggu",
      bukti: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      nama: "Nia",
      handle: "Junior",
      type: "Medium",
      service: "Manicure ~ 1.5 hrs",
      tanggal: "2025-12-30",
      jam: "17:00",
      status: "Menunggu",
      bukti: "https://via.placeholder.com/200",
    },
  ]);

  const [handleFilter, setHandleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const router = useRouter();

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
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  const filteredAppointments = appointments
    .filter((a) => !handleFilter || a.handle === handleFilter)
    .filter((a) => !typeFilter || a.type === typeFilter);

  // FUNGSI TOMBOL
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
    <div className="min-h-screen bg-[#fafafa] font-serif">
      <div className="flex">
        {/* SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#D0BDAC] p-6 flex flex-col">
            <Image
              src="/logo.png"
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
                { label: "Laporan", path: "/admin/laporan" },
                { label: "Review", path: "/admin/review" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    item.path === "/admin/appointment" ? "bg-white" : "hover:bg-white/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 transition text-[20px]">
                ↩ Logout
              </button>
            </div>
          </aside>
        )}

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white shadow flex items-center px-8">
            <button onClick={() => setLeftOpen(!leftOpen)} className="text-[26px] mr-4">☰</button>
            <h1 className="text-[22px] font-semibold mr-6">Kelola Appointment</h1>

            <div className="flex-1 flex justify-center">
              <div className="relative w-[320px]">
                <input
                  className="w-full h-[44px] border border-gray-300 rounded-full px-6 pr-12"
                  placeholder="Search here"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2">🔍</button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <Image
                src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium">Admin</span>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-8 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[28px] font-semibold">Daftar Appointment</h2>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => { setHandleFilter(""); setTypeFilter(""); }}
              >
                Reset Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded-3xl shadow overflow-hidden">
                <thead className="bg-[#F9F9F9] text-[15px] font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama</th>

                    <th className="px-6 py-4">
                      <select
                        className="border rounded-lg px-2 py-1 bg-white"
                        value={handleFilter}
                        onChange={(e) => setHandleFilter(e.target.value)}
                      >
                        <option value="">Handles By</option>
                        <option value="Owner">Owner</option>
                        <option value="Senior">Senior</option>
                        <option value="Junior">Junior</option>
                      </select>
                    </th>

                    <th className="px-6 py-4">
                      <select
                        className="border rounded-lg px-2 py-1 bg-white"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        <option value="">Type</option>
                        <option value="Medium">Medium</option>
                        <option value="Natural">Natural</option>
                      </select>
                    </th>

                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Jam</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Bukti Pembayaran</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-[14px]">
                  {filteredAppointments.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{a.nama}</td>
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
                              ? "bg-green-400"
                              : "bg-red-600" // Ditolak
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {a.bukti ? (
                          <button className="text-blue-600 underline">Lihat Gambar</button>
                        ) : (
                          <span className="text-gray-400 italic">Belum upload</span>
                        )}
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        {a.status === "Ditolak" ? (
                          <button
                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-[12px]"
                            onClick={() => handleDelete(a.id)}
                          >
                            Hapus
                          </button>
                        ) : a.status === "Disetujui" ? null : (
                          <>
                            <button
                              className="px-3 py-1 rounded-lg bg-green-500 text-white text-[12px]"
                              onClick={() => handleApprove(a.id)}
                            >
                              Setujui
                            </button>
                            <button
                              className="px-3 py-1 rounded-lg bg-red-500 text-white text-[12px]"
                              onClick={() => handleReject(a.id)}
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

          </main>
        </div>
      </div>
    </div>
  );
}
