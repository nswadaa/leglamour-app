"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminUser = {
  id: number;
  name: string;
};
type StatData = {
  customers: number;
  appointments: number;
  transactions: number;
};

type TodayAppointment = {
  username: string;
  treatment: string;
  time: string;
  staff: string;
};

export default function AdminPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);

  const [admin, setAdmin] = useState<AdminUser | null | "loading">("loading");
  const [rightOpen, setRightOpen] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      // 1️⃣ cek admin
      const authRes = await fetch("/api/admin", { cache: "no-store" });

      if (authRes.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (authRes.status === 403) {
        router.push("/dashboard");
        return;
      }

      const authData = await authRes.json();
      setAdmin(authData.user);

      // 2️⃣ ambil dashboard data
      const dashRes = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      // 🔥 WAJIB cek status sebelum json
      if (!dashRes.ok) {
        console.error("Dashboard API error", dashRes.status);
        return;
      }

      const dashData = await dashRes.json();

      setStats(dashData.stats);
      setAppointments(dashData.todayAppointments);
    };

    load();
  }, [router]);

  if (admin === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen font-serif relative bg-[#F8F3EF] opacity-100">
      <div className="max-w-[1440px] mx-auto flex min-h-screen">
        {/* LEFT SIDEBAR */}
        {leftOpen && (
          <aside className="w-[260px] bg-[#CBB6A4] p-6 flex flex-col shadow-lg">
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
                  className="text-left px-4 py-2 rounded-lg text-[#3A2E28]hover:bg-[#F8F3EF] hover:shadow transition"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">
          {/* TOPBAR */}
          <header className="h-[80px] bg-[#FAF6F2] shadow-sm flex items-center px-8">
            <button
              onClick={() => setLeftOpen(!leftOpen)}
              className="text-[26px] mr-4"
              title="Toggle Sidebar"
            >
              ☰
            </button>

            <h1 className="text-[22px] mr-6">Dashboard admin</h1>

            <div className="flex-1 flex justify-center">
              <input
                className="w-[280px] h-[40px] border rounded-full px-4"
                placeholder="Search here"
              />
            </div>

            <button
              onClick={() => setRightOpen(!rightOpen)}
              className="text-[28px] px-4"
              title="Toggle Sidebar"
            >
              ≡
            </button>

            <div className="flex items-center gap-2 ml-4">
              <span>Admin</span>
              <button
                onClick={async () => {
                  if (!confirm("Logout dari admin?")) return;

                  await fetch("/api/logout", {
                    method: "POST",
                    credentials: "include", // 🔥 WAJIB
                  });

                  router.replace("/auth/login");

                  router.push("/auth/login");
                }}
                className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>

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
          <main className="flex flex-1 overflow-hidden">
            {/* CENTER CONTENT */}
            <div className="flex-1 p-8 overflow-auto">
              {/* STAT CARDS */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                {stats && (
                  <>
                    <StatCard
                      title={stats?.customers?.toString() ?? "0"}
                      subtitle="Customers"
                    />
                    <StatCard
                      title={stats?.appointments?.toString() ?? "0"}
                      subtitle="Kelola Appointment"
                    />
                    <StatCard
                      title={stats?.transactions?.toString() ?? "0"}
                      subtitle="Kelola Transaksi"
                    />
                    <StatCard
                      title={stats?.transactions?.toString() ?? "0"}
                      subtitle="Laporan"
                      highlighted
                    />
                  </>
                )}
              </div>

              {/* APPOINTMENT */}
              <div className="bg-white rounded-xl shadow border p-5">
                <div className="flex justify-between mb-4">
                  <h3 className="text-[22px]">
                    Appointment hari ini (
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                    )
                  </h3>
                  <button className="bg-[#FDEFE3] px-3 py-1 rounded">
                    View All »
                  </button>
                </div>

                <div className="grid grid-cols-4 bg-[#D0BDAC] px-4 py-2 rounded">
                  <div>Username</div>
                  <div>Treatment</div>
                  <div>Jam</div>
                  <div>Handle by</div>
                </div>

                {appointments.length === 0 && (
                  <div className="text-center text-gray-500 py-6">
                    Tidak ada appointment hari ini
                  </div>
                )}

                {appointments.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 px-4 py-3 border-b">
                    <div>{item.username}</div>
                    <div>{item.treatment}</div>
                    <div>{item.time}</div>
                    <div>{item.staff}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            {rightOpen && (
              <aside className="w-[300px] bg-white border-l shadow-lg p-6 flex flex-col gap-6">
                <SideCard title="New Customers" />
                <SideCard title="New Review" />
              </aside>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({
  title,
  subtitle,
  highlighted,
}: {
  title: string;
  subtitle: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`h-[110px] rounded-xl border shadow px-6 flex flex-col justify-center ${
        highlighted ? "bg-[#D0BDAC]" : "bg-white"
      }`}
    >
      <div className="text-[24px]">{title}</div>
      <div className="text-[18px] text-gray-600">{subtitle}</div>
    </div>
  );
}

function SideCard({ title }: { title: string }) {
  return (
    <div className="border rounded-xl p-4 h-[240px]">
      <h4 className="text-[20px] mb-3">{title}</h4>
      <div className="h-full flex items-center justify-center text-gray-400">
        no data
      </div>
    </div>
  );
}
