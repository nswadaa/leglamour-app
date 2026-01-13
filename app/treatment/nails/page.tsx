"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* =======================
  HELPERS
======================= */
function minutesToHHMM(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function isPastTime(t: string, selectedDate: string | null) {
  if (!selectedDate) return false;

  const today = new Date();
  const [dd, mm, yyyy] = selectedDate.split("-");
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

  if (date.toDateString() !== today.toDateString()) return false;

  const [h, m] = t.split(":").map(Number);
  const slotMinutes = h * 60 + m;
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  return slotMinutes <= nowMinutes;
}

function formatDDMMYYYY(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`;
}

function dateFromDDMMYYYY(s: string) {
  const [dd, mm, yyyy] = s.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

/* =======================
  ICONS
======================= */
function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* =======================
  CALENDAR POPUP
======================= */
function CalendarPopup({
  open,
  onClose,
  onSelect,
  initialMonth,
  selectedDateStr,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (d: Date) => void;
  initialMonth: Date;
  selectedDateStr?: string | null;
}) {
  if (!open) return null;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const [current, setCurrent] = useState(initialMonth);

  const buildGrid = (d: Date) => {
    const first = (new Date(d.getFullYear(), d.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0
    ).getDate();
    return [
      ...Array(first).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  };

  const selected = selectedDateStr ? dateFromDDMMYYYY(selectedDateStr) : null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-36 z-50">
      <div className="bg-white rounded-2xl shadow-lg px-5 py-5 w-[720px] flex gap-6">
        {[0, 1].map((offset) => {
          const m = new Date(
            current.getFullYear(),
            current.getMonth() + offset,
            1
          );
          const grid = buildGrid(m);

          return (
            <div key={offset} className="w-1/2">
              <div className="flex justify-between mb-3">
                {offset === 0 ? (
                  <button
                    onClick={() =>
                      setCurrent(
                        new Date(current.setMonth(current.getMonth() - 1))
                      )
                    }
                  >
                    <ChevronLeftIcon />
                  </button>
                ) : (
                  <div />
                )}

                <div>
                  {months[m.getMonth()]} {m.getFullYear()}
                </div>

                {offset === 1 ? (
                  <button
                    onClick={() =>
                      setCurrent(
                        new Date(current.setMonth(current.getMonth() + 1))
                      )
                    }
                  >
                    <ChevronRightIcon />
                  </button>
                ) : (
                  <div />
                )}
              </div>

              <div className="grid grid-cols-7 text-xs mb-2">
                {days.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-2">
                {grid.map((day, i) =>
                  day ? (
                    <button
                      key={i}
                      onClick={() => {
                        onSelect(new Date(m.getFullYear(), m.getMonth(), day));
                        onClose();
                      }}
                      className={`w-9 h-9 rounded-full ${
                        selected &&
                        selected.getDate() === day &&
                        selected.getMonth() === m.getMonth()
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  ) : (
                    <div key={i} />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =======================
  MAIN PAGE
======================= */
export default function NailsPage() {
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [serviceDuration, setServiceDuration] = useState<number>(0);

  const [infoTime, setInfoTime] = useState<string | null>(null);

  // const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateList, setDateList] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* LOGIN CHECK */
  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d.user));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`/api/services?category=${encodeURIComponent("Nails Art")}`),
      fetch("/api/staff"),
    ])
      .then(async ([a, b]) => {
        if (!a.ok) throw new Error("Service API error");
        if (!b.ok) throw new Error("Staff API error");

        return Promise.all([a.json(), b.json()]);
      })
      .then(([s, st]) => {
        setServices(s);
        setStaffList(st);

        setServiceId(null);
        setServiceDuration(0);
        setSelectedTime(null);
      })
      .catch((err) => {
        console.error("FETCH INIT ERROR:", err);
      });
  }, []);

  useEffect(() => {
    fetch("/api/time-slots")
      .then((r) => r.json())
      .then((data) => {
        setTimeSlots(data.map((t: any) => t.time.slice(0, 5))); // "10:00"
      });
  }, []);

  /* DATE STRIP */
  useEffect(() => {
    const base = new Date();
    const list = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return formatDDMMYYYY(d);
    });
    setDateList(list);
    setSelectedDate(list[0]);
  }, []);

  /* BLOCKED TIMES */
  // useEffect(() => {
  //   if (!staffId || !selectedDate) return;
  //   fetch(`/api/bookings/blocked?staffId=${staffId}&date=${selectedDate}`)
  //     .then((r) => r.json())
  //     .then(setBlockedTimes);
  // }, [staffId, selectedDate]);

  // ===============================
  // DURASI SLOT YANG DIPILIH USER
  // ===============================
  const selectedStartMinutes = selectedTime
    ? (() => {
        const [h, m] = selectedTime.split(":").map(Number);
        return h * 60 + m;
      })()
    : null;

  const selectedEndMinutes =
    selectedStartMinutes !== null
      ? selectedStartMinutes + serviceDuration
      : null;

  const timeSlotStates = timeSlots.map((t) => {
    const [h, m] = t.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + serviceDuration;

    const endTime = minutesToHHMM(endMinutes);
    const isPast = isPastTime(t, selectedDate);
    const exceedsClose = endMinutes > 22 * 60;

    // ⛔ LOGIKA BARU: overlap dengan slot yang DIPILIH SENDIRI
    const overlapWithSelected =
      selectedStartMinutes !== null &&
      selectedEndMinutes !== null &&
      startMinutes > selectedStartMinutes &&
      startMinutes < selectedEndMinutes;

    let reason = "";
    if (overlapWithSelected) reason = "Masih dalam durasi treatment";
    else if (exceedsClose)
      reason = `Selesai ${endTime} (melewati jam tutup 22:00)`;
    else if (isPast) reason = "Jam sudah lewat";

    return {
      time: t,
      endTime,
      disabled: isPast || exceedsClose || overlapWithSelected,
      reason,
    };
  });

  useEffect(() => {
    if (!selectedTime) return;

    const slot = timeSlotStates.find((t) => t.time === selectedTime);

    if (slot?.disabled) {
      setSelectedTime(null);
    }
  }, [serviceDuration, selectedDate]);

  const handleCalendarSelect = (d: Date) => {
    const formatted = formatDDMMYYYY(d);
    setSelectedDate(formatted);

    const list = Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + i);
      return formatDDMMYYYY(nd);
    });

    setDateList(list);
  };

  /* ADD TO CART */
  const handleAddToCart = async () => {
    if (!isLoggedIn) return setShowLoginModal(true);

    if (!serviceId || !staffId || !selectedDate || !selectedTime) {
      alert("Lengkapi semua pilihan");
      return;
    }

    const res = await fetch("/api/bookings/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        treatmentId: serviceId, // 🔥 INI KUNCINYA
        staffId,
        date: selectedDate,
        time: selectedTime,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Gagal menambahkan ke cart");
      return;
    }

    router.push("/cart");
  };

  return (
    <div className="w-full px-8 py-10 flex flex-col lg:flex-row justify-between gap-10 select-none">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <span className="cursor-pointer text-sm" onClick={() => router.back()}>
          ‹ Kembali
        </span>
        <h2 className="text-2xl font-semibold mt-2">BOOK AN APPOINTMENT</h2>

        <div className="bg-[#F5F5F5] p-6 rounded-2xl shadow-sm mt-6">
          {/* Staff & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-1 block">Nails handled by</label>
              <select
                className="w-full p-2 bg-white border rounded-md"
                value={staffId ?? ""}
                onChange={(e) => setStaffId(Number(e.target.value))}
              >
                <option value="">--Handled by--</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Service</label>
              <select
                className="w-full p-2 bg-white border rounded-md"
                value={serviceId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setServiceId(id);

                  const svc = services.find((s) => s.id === id);
                  setServiceDuration(svc?.duration ?? 0);
                }}
              >
                <option value="">---Treatment nails---</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {Number(s.duration) / 60} hrs
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates strip + calendar open */}
          <label className="text-sm block mt-5">Tanggal</label>
          <div className="flex items-center gap-4 mt-3">
            <div className="grid grid-cols-7 gap-3">
              {dateList.map((d) => {
                const isActive = selectedDate === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm border
                      ${
                        isActive
                          ? "bg-red-600 text-white font-semibold"
                          : "bg-white"
                      }`}
                  >
                    {d.slice(0, 2)}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCalendarOpen(true)}
              className="p-3 bg-white rounded-lg border shadow-sm"
              aria-label="Open calendar"
            >
              <img src="/kalender.png" alt="calendar" className="w-5 h-5" />
            </button>

            <input
              type="date"
              ref={dateInputRef}
              className="hidden"
              onChange={(e) => {
                const d = new Date(e.target.value);
                setSelectedDate(formatDDMMYYYY(d));
              }}
            />
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {timeSlotStates.map(({ time, endTime, disabled, reason }) => (
              <div key={time} className="relative group">
                <button
                  disabled={disabled}
                  onClick={() => !disabled && setSelectedTime(time)}
                  className={`w-full py-2 rounded-md border text-sm transition
          ${
            disabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : selectedTime === time
              ? "bg-black text-white"
              : "bg-white hover:border-black"
          }`}
                >
                  <div>{time}</div>
                  {serviceDuration > 0 && (
                    <div className="text-[10px] opacity-70">
                      Ends at {endTime}
                    </div>
                  )}
                </button>

                {/* TOOLTIP */}
                {disabled && reason && (
                  <>
                    {/* DESKTOP (hover) */}
                    <div
                      className="absolute z-10 hidden group-hover:block 
      -top-10 left-1/2 -translate-x-1/2
      bg-black text-white text-xs px-2 py-1 rounded shadow"
                    >
                      {reason}
                    </div>

                    {/* MOBILE (tap) */}
                    <button
                      type="button"
                      onClick={() =>
                        setInfoTime(infoTime === time ? null : time)
                      }
                      className="absolute top-1 right-1 text-[10px] bg-black text-white w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      i
                    </button>

                    {infoTime === time && (
                      <div
                        className="absolute z-20 -top-12 left-1/2 -translate-x-1/2
        bg-black text-white text-xs px-2 py-1 rounded shadow"
                      >
                        {reason}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="flex justify-end">
            <button
              onClick={handleAddToCart}
              className="mt-8 px-6 py-2 bg-[#8A4B20] text-white text-sm rounded-md shadow-md"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <img
          src="/pricelist-nails.png"
          className="w-[260px] rounded shadow"
          alt="pricelist"
        />
        <p className="text-sm text-left mt-5 max-w-xs">
          <span className="font-semibold">Details :</span>
          <br />
          Owner, Senior, atau Junior—tinggal pilih siapa yang mau ngerjain
          treatment kamu, plus pilih juga jam yang kamu mau.
        </p>
      </div>

      {/* Calendar popup */}
      <CalendarPopup
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={handleCalendarSelect}
        initialMonth={new Date()}
        selectedDateStr={selectedDate}
      />

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-xs text-center">
            <p className="text-sm mb-4">
              Anda harus login terlebih dahulu untuk melanjutkan booking.
            </p>

            <button
              className="w-full bg-black text-white py-2 rounded mb-2"
              onClick={() => router.push("/auth/login")}
            >
              Login Sekarang
            </button>

            <button
              className="w-full py-2 rounded border"
              onClick={() => setShowLoginModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
