"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= TYPE ================= */
type Role = {
  role: string;
};

export default function EditStaffPage() {
  const router = useRouter();

  /* ===== PARAMS (FIX NaN BUG) ===== */
  const params = useParams();
  const staffId = Number(params.id); // ⬅️ INI PENTING

  /* ===== STATE ===== */
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);

  /* ===== FETCH STAFF BY ID (INI YANG KAMU TANYA) ===== */
  useEffect(() => {
    if (!staffId) return;

    fetch(`/api/staff/${staffId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Staff tidak ditemukan");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
        setRole(data.role);
        setIsActive(data.isActive);
      })
      .catch((err) => alert(err.message));
  }, [staffId]);

  /* ===== FETCH ROLES ===== */
  useEffect(() => {
    fetch("/api/staff/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  /* ===== SAVE ===== */
  const save = async () => {
    await fetch(`/api/staff/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role,
        is_active: isActive,
      }),
    });

    router.push("/admin/kelola-staff");
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-md mx-auto">
      <h1 className="font-semibold text-lg mb-6">Edit Staff</h1>

      <input
        type="text"
        placeholder="Nama Staff"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm mb-4"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm mb-4"
      >
        <option value="">-- Pilih Role --</option>
        {roles.map((r) => (
          <option key={r.role} value={r.role}>
            {r.role}
          </option>
        ))}
      </select>

      <select
        value={isActive}
        onChange={(e) => setIsActive(Number(e.target.value))}
        className="w-full border rounded-lg px-4 py-2 text-sm mb-6"
      >
        <option value={1}>Aktif</option>
        <option value={0}>Nonaktif</option>
      </select>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
        >
          Batal
        </button>
        <button
          onClick={save}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
