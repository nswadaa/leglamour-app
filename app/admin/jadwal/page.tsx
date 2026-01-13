"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: number;
  name: string;
};

export default function JadwalPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");

  const [handleBy, setHandleBy] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // tanggal hari ini + 5 hari
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // jam
  const [times, setTimes] = useState(
    [
      "10.00","11.00","12.00","13.00",
      "14.00","15.00","16.00","17.00",
      "18.00","19.00","20.00","21.00",
    ].map((t) => ({ time: t, status: "open" as "open" | "close" }))
  );

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
    setTimes(times.map((t) => ({ ...t, status })));
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
    return (
      <div className="h-full flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <section className="p-10">

      {/* FILTER */}
      <div className="flex items-center gap-6 mb-8">

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

        <div className="flex gap-3">
          {dateOptions.map((d, i) => {
            const formatted = d.toISOString().split("T")[0];
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(formatted)}
                className={`w-[55px] h-[55px] rounded-full text-lg font-medium transition
                  ${
                    selectedDate === formatted
                      ? "bg-black text-white scale-110"
                      : "bg-[#D0BDAC] hover:bg-[#c7b39d]"
                  }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-2xl"
          >
            📅
          </button>

          {showCalendar && (
            <div className="absolute top-10 bg-white border p-2 rounded-xl shadow">
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

        <button
          className="bg-gray-300 rounded-full px-6 py-2"
          onClick={addTime}
        >
          + Tambah
        </button>

        <div className="flex items-center gap-2 ml-auto bg-gray-200 px-4 py-1 rounded-full">
          For All
          <button
            onClick={() => setAllStatus("open")}
            className="bg-green-400 px-4 py-1 rounded-full text-white"
          >
            open
          </button>
          <button
            onClick={() => setAllStatus("close")}
            className="bg-red-500 px-4 py-1 rounded-full text-white"
          >
            close
          </button>
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
    </section>
  );
}
