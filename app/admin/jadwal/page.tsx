"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminUser = {
  id: number;
  name: string;
};

export default function JadwalPage() {
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [leftOpen, setLeftOpen] = useState(true);
  const router = useRouter();

  const [handleBy, setHandleBy] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Generate tanggal hari ini + 5 hari
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // 🔥 JAM DENGAN STATUS
  const [times, setTimes] = useState(
    [
      "10.00","11.00","12.00","13.00",
      "14.00","15.00","16.00","17.00",
      "18.00","19.00","20.00","21.00"
    ].map((t) => ({ time: t, status: "open" }))
  );

  // input tambah jam
  const [newTime, setNewTime] = useState("");

  const addTime = () => {
    if (!newTime.trim()) return;
    setTimes([...times, { time: newTime.trim(), status: "open" }]);
    setNewTime("");
  };

  const updateStatus = (index: number, status: "open" | "close") => {
    const updated = [...times];
    updated[index].status = status;
    setTimes(updated);
  };

  const setAllStatus = (status: "open" | "close") => {
    const updated = times.map((t) => ({ ...t, status }));
    setTimes(updated);
  };

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

  return (
    <div className="min-h-screen bg-[#fafafa] font-serif">
      <div className="flex">

        {/* LEFT SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#D0BDAC] p-6 min-h-screen flex flex-col">
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
                { label: "Laporan", path: "/admin/laporan" },
                { label: "Review", path: "/admin/review" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    item.path === "/admin/jadwal" ? "bg-white" : "hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>


            <button className="mt-auto flex items-center gap-2 text-[18px]">
              ↪ Logout
            </button>
          </aside>
        )}

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white shadow flex items-center px-8 gap-4">
            <button onClick={() => setLeftOpen(!leftOpen)} className="text-2xl">☰</button>
            <h1 className="text-[22px]">Kelola Jadwal</h1>

            <div className="flex-1 flex justify-center">
              
            </div>

            <div className="flex items-center gap-2">
              <span>Admin</span>
              <Image
                src="/367457490_818409589817476_6810223495379689772_n-removebg-preview.png"
                width={36}
                height={36}
                alt="avatar"
                className="rounded-full"
              />
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-10">

            {/* FILTERS */}
            <div className="flex items-center gap-6 mb-8">

              {/* Handles By */}
              <select
                className="border rounded-full px-6 py-2"
                value={handleBy}
                onChange={(e) => setHandleBy(e.target.value)}
              >
                <option value="">--Handles by--</option>
                <option value="owner">Owner</option>
                <option value="senior">Senior</option>
                <option value="junior">Junior</option>
              </select>

              {/* Tanggal bulat */}
              <div className="flex gap-3">
                {dateOptions.map((d, i) => {
                  const formatted = d.toISOString().split("T")[0];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(formatted)}
                      className={`
                        w-[55px] h-[55px] rounded-full text-[18px] font-medium transition
                        ${selectedDate === formatted
                          ? "bg-black text-white scale-110"
                          : "bg-[#D0BDAC] text-black hover:bg-[#c7b39d]"}
                      `}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Kalender 📅 */}
              <div className="relative">
                <button onClick={() => setShowCalendar(!showCalendar)} className="text-[24px]">📅</button>
                {showCalendar && (
                  <div className="absolute top-10 left-1 bg-white border p-2 rounded-xl shadow-lg">
                    <input
                      type="date"
                      className="border rounded-lg p-2"
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* TAMBAH JAM */}
            <div className="flex items-center gap-4 mb-10">
              <input
                className="w-[300px] h-[48px] bg-gray-200 rounded-full px-5"
                placeholder="Tambah Jam"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <button className="bg-gray-300 rounded-full px-6 py-2" onClick={addTime}>+ Tambah</button>

              <div className="flex items-center gap-2 ml-auto bg-gray-200 px-4 py-1 rounded-full">For All
                <button onClick={() => setAllStatus("open")} className="bg-green-400 px-4 py-1 rounded-full text-white">open</button>
                <button onClick={() => setAllStatus("close")} className="bg-red-500 px-4 py-1 rounded-full text-white">close</button>
              </div>
            </div>

            {/* JAM LIST */}
            <div className="grid grid-cols-4 gap-8">
              {times.map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-2">

                  <div className="bg-[#D0BDAC] w-[150px] py-3 rounded-xl text-center font-medium">
                    {t.time}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(i, "open")}
                      className={`px-4 py-1 rounded-full text-white ${
                        t.status === "open" ? "bg-green-600" : "bg-green-400"
                      }`}
                    >
                      open
                    </button>
                    <button
                      onClick={() => updateStatus(i, "close")}
                      className={`px-4 py-1 rounded-full text-white ${
                        t.status === "close" ? "bg-gray-500" : "bg-red-500"
                      }`}
                    >
                      close
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
