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

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      // cek admin
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

      // ambil dashboard data
      const dashRes = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

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
    <div className="min-h-screen font-serif bg-[#FFFF]">
      <div className="max-w-[1440px] mx-auto flex min-h-screen">
        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">
          {/* CONTENT */}
          <main className="flex flex-1 overflow-hidden">
            {/* CENTER */}
            {/* CENTER */}
            <div className="flex-1 overflow-auto">
              <section className="p-6">
                {/* CARDS */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        title: "Customers",
                        value: stats.customers,
                        icon: "/customers.png",
                      },
                      {
                        title: "Kelola Appointment",
                        value: stats.appointments,
                        icon: "/appoitment.png",
                      },
                      {
                        title: "Kelola Transaksi",
                        value: stats.transactions,
                        icon: "/payment.png",
                      },
                      {
                        title: "Laporan",
                        value: stats.transactions,
                        icon: "/laporan.png",
                        active: true,
                      },
                    ].map((c) => (
                      <div
                        key={c.title}
                        className={`rounded-xl p-4 shadow ${
                          c.active ? "bg-[#d8c6b5]" : "bg-white"
                        }`}
                      >
                        <div className="text-lg font-semibold mb-2">
                          {c.value}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{c.title}</span>
                          <Image
                            src={c.icon}
                            alt={c.title}
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TABLE + SIDE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* APPOINTMENT TABLE */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-semibold">Appointment hari ini</h3>
                      <button
                        onClick={() => router.push("/admin/appointment")}
                        className="text-sm text-[#b08968]"
                      >
                        View All →
                      </button>
                    </div>

                    <table className="w-full text-sm">
                      <thead className="bg-[#d8c6b5]">
                        <tr>
                          <th className="p-2 text-left">Username</th>
                          <th className="p-2 text-left">Treatment</th>
                          <th className="p-2 text-left">Jam</th>
                          <th className="p-2 text-left">Handle by</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="p-6 text-center text-gray-400"
                            >
                              Belum ada appointment
                            </td>
                          </tr>
                        ) : (
                          appointments.map((item, i) => (
                            <tr key={i} className="border-b">
                              <td className="p-2">{item.username}</td>
                              <td className="p-2">{item.treatment}</td>
                              <td className="p-2">{item.time}</td>
                              <td className="p-2">{item.staff}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* RIGHT SIDE MINI CARDS */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow p-4 h-40">
                      <h3 className="font-semibold mb-2">New Customers</h3>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 h-40">
                      <h3 className="font-semibold mb-2">New Review</h3>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ==== COMPONENTS ==== */

function StatCard({
  title,
  label,
  highlight,
}: {
  title: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 shadow ${
        highlight ? "bg-[#E7D5C6]" : "bg-white"
      }`}
    >
      <div className="text-2xl font-semibold">{title}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
}

function SideCard({ title }: { title: string }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-gray-500">Belum ada data</p>
    </div>
  );
}
