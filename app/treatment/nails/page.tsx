"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------------
  CONFIG / DUMMY DATA
----------------------------------------*/
const dummyBookings = [
  { date: "20-01-2025", staff: "Owner", start: "14.00", end: "16.00" },
  { date: "20-01-2025", staff: "Senior", start: "10.00", end: "11.00" },
  { date: "21-01-2025", staff: "Junior", start: "13.00", end: "15.00" },
];

const servicesDuration: Record<string, number> = {
  "Basic Gel Polish – 2hrs": 2,
  "Soft Tip Extension – 2hrs": 2,
  "Gel Removal – 1hr": 1,
  "Basic Gel Polish + Removal – 3hrs": 3,
  "Soft Tip + Removal – 3hrs": 3,
};

const times = [
  "10.00","11.00","12.00","13.00","14.00","15.00",
  "16.00","17.00","18.00","19.00","20.00","21.00"
];

const servicesList = [
  "Basic Gel Polish – 2hrs",
  "Soft Tip Extension – 2hrs",
  "Gel Removal – 1hr",
  "Basic Gel Polish + Removal – 3hrs",
  "Soft Tip + Removal – 3hrs",
];

const serviceIds: Record<string, number> = {
  "Basic Gel Polish – 2hrs": 1,
  "Soft Tip Extension – 2hrs": 2,
  "Gel Removal – 1hr": 3,
  "Basic Gel Polish + Removal – 3hrs": 4,
  "Soft Tip + Removal – 3hrs": 5,
};

const staffIds: Record<string, number> = {
  Owner: 1,
  Senior: 2,
  Junior: 3,
};


/* ---------------------------------------
  HELPERS
----------------------------------------*/
function formatDDMMYYYY(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

function dateFromDDMMYYYY(s: string) {
  // expects "dd-mm-yyyy"
  const [dd, mm, yyyy] = s.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

/* ---------------------------------------
  Small inline chevrons (no external icon lib)
----------------------------------------*/
function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------------------------------------
  CalendarPopup - two months compact
  - NO "125" numbers
  - smaller width so it won't dominate screen
----------------------------------------*/
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
  const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const daysShort = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

  const [current, setCurrent] = useState<Date>(initialMonth);

  useEffect(() => {
    setCurrent(initialMonth);
  }, [initialMonth]);

  if (!open) return null;

  const changeMonth = (dir: number) => {
    const n = new Date(current);
    n.setMonth(current.getMonth() + dir);
    setCurrent(n);
  };

  const buildMonthGrid = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    const firstDayRaw = new Date(year, month, 1).getDay(); // 0 Sun ... 6 Sat
    const firstDay = (firstDayRaw + 6) % 7; // shift to Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let i = 1; i <= daysInMonth; i++) grid.push(i);
    return grid;
  };

  const leftGrid = buildMonthGrid(current);
  const rightMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  const rightGrid = buildMonthGrid(rightMonth);
  const today = new Date();
  const selectedDate = selectedDateStr ? dateFromDDMMYYYY(selectedDateStr) : null;

  return (
    // overlay positioning centered horizontally, a bit lower vertically
    <div className="fixed left-1/2 -translate-x-1/2 top-36 z-50">
      <div className="bg-white rounded-2xl shadow-lg px-5 py-5 w-[720px] max-w-[94vw] flex gap-6">
        {/* LEFT MONTH */}
        <div className="w-1/2">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => changeMonth(-1)} className="p-1 rounded hover:bg-gray-100">
              <ChevronLeftIcon />
            </button>

            <div className="text-lg font-medium">
              {months[current.getMonth()]} {current.getFullYear()}
            </div>

            <div style={{ width: 36 }} />
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
            {daysShort.map((d) => <div key={d} className="font-semibold">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {leftGrid.map((day, i) => {
              const isToday = day === today.getDate() && current.getMonth() === today.getMonth() && current.getFullYear() === today.getFullYear();
              const isSelected = selectedDate ? (day === selectedDate.getDate() && current.getMonth() === selectedDate.getMonth() && current.getFullYear() === selectedDate.getFullYear()) : false;

              return (
                <div key={i} className="flex flex-col items-center">
                  {day ? (
                    <button
                      onClick={() => { onSelect(new Date(current.getFullYear(), current.getMonth(), day)); onClose(); }}
                      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm
                        ${isSelected ? 'bg-red-600 text-white font-semibold' : isToday ? 'border border-red-500 text-red-600' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      {String(day).padStart(2, "0")}
                    </button>
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT MONTH */}
        <div className="w-1/2">
          <div className="flex items-center justify-between mb-3">
            <div style={{ width: 36 }} />
            <div className="text-lg font-medium">
              {months[rightMonth.getMonth()]} {rightMonth.getFullYear()}
            </div>
            <button onClick={() => changeMonth(1)} className="p-1 rounded hover:bg-gray-100">
              <ChevronRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
            {daysShort.map((d) => <div key={d} className="font-semibold">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {rightGrid.map((day, i) => {
              const isToday = day === today.getDate() && rightMonth.getMonth() === today.getMonth() && rightMonth.getFullYear() === today.getFullYear();
              const isSelected = selectedDate ? (day === selectedDate.getDate() && rightMonth.getMonth() === selectedDate.getMonth() && rightMonth.getFullYear() === selectedDate.getFullYear()) : false;

              return (
                <div key={i} className="flex flex-col items-center">
                  {day ? (
                    <button
                      onClick={() => { onSelect(new Date(rightMonth.getFullYear(), rightMonth.getMonth(), day)); onClose(); }}
                      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm
                        ${isSelected ? 'bg-red-600 text-white font-semibold' : isToday ? 'border border-red-500 text-red-600' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      {String(day).padStart(2, "0")}
                    </button>
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------
  Main page component (Nails booking)
----------------------------------------*/
export default function NailsPage() {
  const [staff, setStaff] = useState("");
  const [service, setService] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateList, setDateList] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Replace with real auth later
 const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

useEffect(() => {
  async function checkLogin() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();

      if (data.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }

  checkLogin();
}, []);


  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // generate 7-day strip from today
    const days: string[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(formatDDMMYYYY(d));
    }
    setDateList(days);
    setSelectedDate(days[0]);
  }, []);

  // blocked times (dummy)
  const getBlockedTimes = () => {
    if (!staff || !selectedDate) return [];
    const bookings = dummyBookings.filter(b => b.staff === staff && b.date === selectedDate);
    const blocked: string[] = [];
    bookings.forEach(b => {
      const startHour = parseInt(b.start.split(".")[0]);
      const endHour = parseInt(b.end.split(".")[0]);
      for (let h = startHour; h < endHour; h++) {
        blocked.push(`${String(h).padStart(2, "0")}.00`);
      }
    });
    return blocked;
  };

  const getAvailableTimes = () => {
    if (!service) return times;
    const duration = servicesDuration[service];
    const blocked = getBlockedTimes();
    return times.filter((t) => {
      const start = parseInt(t.split(".")[0]);
      for (let i = 0; i < duration; i++) {
        const checkHour = `${String(start + i).padStart(2, "0")}.00`;
        if (blocked.includes(checkHour)) return false;
      }
      if (start + duration > 22) return false;
      return true;
    });
  };

  const availableTimes = getAvailableTimes();

  const handlePayment = () => {
  if (!isLoggedIn) {
    setShowLoginModal(true);
    return;
  }

  if (!service || !staff || !selectedDate || !selectedTime) {
    alert("Lengkapi pilihan staff, service, tanggal, dan waktu.");
    return;
  }

  // router.push(
  //   `/payment?service=${encodeURIComponent(service)}&staff=${encodeURIComponent(
  //     staff
  //   )}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(
  //     selectedTime
  //   )}&dp=20000`
  // );

  router.push(
  `/payment?serviceId=${serviceIds[service]}&staffId=${staffIds[staff]}&date=${encodeURIComponent(
    selectedDate
  )}&time=${encodeURIComponent(selectedTime)}&dp=20000`
);

};

  const handleCalendarSelect = (d: Date) => {
    const formatted = formatDDMMYYYY(d);
    setSelectedDate(formatted);

    // rebuild 7-day strip starting from picked date
    const newStrip: string[] = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(d);
      dd.setDate(d.getDate() + i);
      newStrip.push(formatDDMMYYYY(dd));
    }
    setDateList(newStrip);
  };

  return (
    <div className="w-full px-8 py-10 flex flex-col lg:flex-row justify-between gap-10 select-none">
      {/* LEFT */}
      <div className="w-full lg:w-2/3">
        <span
            className="cursor-pointer text-sm"
            onClick={() => router.back()}
            >
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
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
              >
                <option value="">--Handled by--</option>
                <option value="Owner">Owner</option>
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
              </select>
            </div>

            <div>
              <label className="text-sm mb-1 block">Service</label>
              <select
                className="w-full p-2 bg-white border rounded-md"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">---Treatment nails---</option>
                {servicesList.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
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
                      ${isActive ? "bg-red-600 text-white font-semibold" : "bg-white"}`}
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
            {availableTimes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 rounded-md border text-sm
                  ${selectedTime === t ? "bg-black text-white" : "bg-white"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Payment */}
          <div className="flex justify-end">
            <button
              onClick={handlePayment}
              className="mt-8 px-6 py-2 bg-[#8A4B20] text-white text-sm rounded-md shadow-md"
            >
              PAYMENT
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col items-center">
        <img src="/pricelist-nails.png" className="w-[260px] rounded shadow" alt="pricelist" />
        <p className="text-sm text-left mt-5 max-w-xs">
          <span className="font-semibold">Details :</span><br />
          Owner, Senior, atau Junior—tinggal pilih siapa yang mau ngerjain treatment kamu,
          plus pilih juga jam yang kamu mau.
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
