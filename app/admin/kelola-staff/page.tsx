"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ================= TYPE ================= */
type Staff = {
  id: number;
  name: string;
  role: string;
  isActive: number; // 1 / 0
};

export default function KelolaStaffPage() {
  /* ================= STATE ================= */
  const [staffs, setStaffs] = useState<Staff[]>([]);

  /* ================= FETCH ================= */
  const fetchStaff = async () => {
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaffs(data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (item: Staff) => {
    setStaffs((prev) =>
      prev.map((s) =>
        s.id === item.id ? { ...s, isActive: s.isActive ? 0 : 1 } : s,
      ),
    );

    await fetch(`/api/staff/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        role: item.role,
        is_active: item.isActive ? 0 : 1,
      }),
    });
  };

  /* ================= DELETE ================= */
  const deleteStaff = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus staff ini?");
    if (!ok) return;

    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    fetchStaff();
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
      {/* HEADER */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/kelola-staff/add"
          className="bg-black text-white px-5 py-2 rounded-full text-sm"
        >
          + Add Staff
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm text-center">
          <thead>
            <tr className="border-b">
              <th className="py-3 font-semibold">No</th>
              <th className="py-3 font-semibold">Nama</th>
              <th className="py-3 font-semibold">Role</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {staffs.map((item, index) => (
              <tr key={item.id} className="border-b last:border-none">
                {/* AUTO NUMBER */}
                <td className="py-4">{index + 1}</td>

                <td className="py-4">{item.name}</td>
                {/* ROLE */}
                <td className="py-4 capitalize font-medium">{item.role}</td>

                {/* STATUS */}
                <td className="py-4">
                  <div
                    className="inline-flex cursor-pointer"
                    onClick={() => toggleStatus(item)}
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer pointer-events-none"
                      checked={item.isActive === 1}
                      readOnly
                    />

                    <div
                      className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-black relative
    after:absolute after:top-[2px] after:left-[2px]
    after:bg-white after:h-4 after:w-4 after:rounded-full
    after:transition peer-checked:after:translate-x-4"
                    />
                  </div>
                </td>

                {/* ACTION */}
                <td className="py-4">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/admin/kelola-staff/edit/${item.id}`}
                      className="bg-gray-200 px-4 py-1 rounded-full text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteStaff(item.id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-full text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {staffs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-gray-500">
                  Data staff kosong
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
