"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ================= TYPE ================= */
type AdminUser = {
  id: number;
  name: string;
};

type TimeSlot = {
  id: number;
  time: string; // "10:00"
  status: "open" | "close";
};

export default function JadwalPage() {
  const router = useRouter();

  const [handles, setHandles] = useState<string[]>([]);

  /* ================= DATE ================= */
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [handleBy, setHandleBy] = useState("");

  /* ================= AUTH ================= */
  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");

  /* ================= SCHEDULE ================= */
  const [schedules, setSchedules] = useState<Record<string, TimeSlot[]>>({});
  const times = schedules[selectedDate] || [];

  /* ================= EDIT ================= */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTime, setEditTime] = useState("");

  /* ================= ADD ================= */
  const [newTime, setNewTime] = useState("");

  /* ================= DATE OPTIONS ================= */
  const baseDate = new Date(selectedDate);
  const dateOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return d;
  });

  /* ================= LOAD SLOTS (DB) ================= */
  const loadSlots = async () => {
    const res = await fetch("/api/time-slots", { cache: "no-store" });
    const data = await res.json();

    setSchedules({
      [selectedDate]: data.map((t: any) => ({
        id: t.id,
        time: t.time.slice(0, 5),
        status: t.isActive ? "open" : "close",
      })),
    });
  };

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  useEffect(() => {
    const loadHandles = async () => {
      const res = await fetch("/api/staff/handles", {
        cache: "no-store",
      });
      const data = await res.json();
      setHandles(data.map((d: any) => d.role));
    };

    loadHandles();
  }, []);

  /* ================= ADD ================= */
  const addTime = async () => {
    if (!newTime.trim()) return;

    const res = await fetch("/api/time-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: `${newTime}:00` }),
    });

    if (res.status === 409) {
      const data = await res.json();
      alert(data.message); // "Jam sudah ada"
      return;
    }

    setNewTime("");
    loadSlots();
  };

  /* ================= TOGGLE STATUS ================= */
  const updateStatus = async (slot: TimeSlot, status: "open" | "close") => {
    setSchedules((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((t) =>
        t.id === slot.id ? { ...t, status } : t,
      ),
    }));

    await fetch(`/api/time-slots/${slot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: status === "open" }),
    });
  };

  /* ================= SET ALL ================= */
  const setAllStatus = async (status: "open" | "close") => {
    await Promise.all(
      times.map((t) =>
        fetch(`/api/time-slots/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: status === "open" }),
        }),
      ),
    );

    setSchedules((prev) => ({
      ...prev,
      [selectedDate]: times.map((t) => ({ ...t, status })),
    }));
  };

  /* ================= EDIT ================= */
  const startEdit = (t: TimeSlot) => {
    setEditingId(t.id);
    setEditTime(t.time);
  };

  const saveEdit = async (t: TimeSlot) => {
    if (!editTime.match(/^\d{2}:\d{2}$/)) {
      alert("Format jam harus HH:MM");
      return;
    }

    const newTime = editTime;

    const res = await fetch(`/api/time-slots/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: `${newTime}:00`,
      }),
    });

    if (res.status === 409) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    // ✅ OPTIMISTIC UPDATE (INI KUNCINYA)
    setSchedules((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((slot) =>
        slot.id === t.id ? { ...slot, time: newTime } : slot,
      ),
    }));

    setEditingId(null);
    setEditTime("");
  };

  /* ================= DELETE ================= */
  const deleteTime = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus jam ini?");
    if (!ok) return;

    await fetch(`/api/time-slots/${id}`, { method: "DELETE" });
    loadSlots();
  };

  /* ================= AUTH ================= */
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

  /* ================= UI ================= */
  return (
    <section className="p-4 sm:p-8">
      {/* FILTER */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-center">
        <select
          className="border rounded-full px-5 py-2 w-full sm:w-[220px]"
          value={handleBy}
          onChange={(e) => setHandleBy(e.target.value)}
        >
          <option value="">Handles by</option>

          {handles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* DATE BUTTON */}
        <div className="flex gap-3">
          {dateOptions.map((d, i) => {
            const formatted = d.toISOString().split("T")[0];
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(formatted)}
                className={`w-12 h-12 rounded-full font-medium transition ${
                  selectedDate === formatted
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        {/* CALENDAR */}
        <label className="relative cursor-pointer">
          <Image src="/kalender.png" alt="calendar" width={20} height={20} />
          <input
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      {/* ADD */}
      <div className="flex flex-wrap gap-4 mb-10">
        <input
          className="bg-gray-200 rounded-full px-5 py-2 w-[220px]"
          placeholder="Tambah Jam"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />

        <button
          onClick={addTime}
          className="bg-gray-300 px-5 py-2 rounded-full"
        >
          + Tambah
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setAllStatus("open")}
            className="bg-green-600 text-white px-4 py-1 rounded-full"
          >
            Open
          </button>
          <button
            onClick={() => setAllStatus("close")}
            className="bg-red-600 text-white px-4 py-1 rounded-full"
          >
            Close
          </button>
        </div>
      </div>

      {/* TIME LIST */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {times.map((t) => (
          <div key={t.id} className="flex flex-col items-center gap-3">
            <div className="bg-white border rounded-xl w-full py-3 text-center">
              {editingId === t.id ? (
                <input
                  className="w-full text-center outline-none"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              ) : (
                t.time
              )}
            </div>

            <div className="flex gap-2 text-xs">
              {editingId === t.id ? (
                <button
                  onClick={() => saveEdit(t)}
                  className="px-3 py-1 rounded-full bg-blue-600 text-white"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEdit(t)}
                  className="px-3 py-1 rounded-full bg-gray-300"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => deleteTime(t.id)}
                className="px-3 py-1 rounded-full bg-red-500 text-white"
              >
                Delete
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(t, "open")}
                className={`px-4 py-1 rounded-full text-white ${
                  t.status === "open" ? "bg-green-600" : "bg-green-400"
                }`}
              >
                open
              </button>
              <button
                onClick={() => updateStatus(t, "close")}
                className={`px-4 py-1 rounded-full text-white ${
                  t.status === "close" ? "bg-red-600" : "bg-red-400"
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
