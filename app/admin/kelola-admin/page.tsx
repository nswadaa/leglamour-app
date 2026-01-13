"use client";

import { useState } from "react";

type Admin = {
  id: number;
  no: number;
  role: string;
  active: boolean;
};

export default function KelolaAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, no: 1, role: "Owner", active: true },
    { id: 2, no: 2, role: "Senior", active: true },
    { id: 3, no: 3, role: "Junior", active: false },
  ]);

  /* ========== ADD STATE ========== */
  const [open, setOpen] = useState(false);
  const [no, setNo] = useState("");
  const [role, setRole] = useState("");

  /* ========== EDIT STATE ========== */
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState("");

  const addAdmin = () => {
    if (!no || !role) return;

    setAdmins([
      ...admins,
      {
        id: Date.now(),
        no: Number(no),
        role,
        active: true,
      },
    ]);

    setNo("");
    setRole("");
    setOpen(false);
  };

  const openEdit = (item: Admin) => {
    setEditId(item.id);
    setEditRole(item.role);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editId || !editRole) return;

    setAdmins((prev) =>
      prev.map((item) =>
        item.id === editId ? { ...item, role: editRole } : item
      )
    );

    setEditOpen(false);
    setEditId(null);
    setEditRole("");
  };

  const deleteAdmin = (id: number) => {
    setAdmins(admins.filter((item) => item.id !== id));
  };

  const toggleStatus = (id: number) => {
    setAdmins(
      admins.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      {/* HEADER */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-400 text-white px-5 py-2 rounded-full hover:opacity-90"
        >
          + Add
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-3 font-semibold">No</th>
            <th className="py-3 font-semibold">Handles by</th>
            <th className="py-3 font-semibold">Status</th>
            <th className="py-3 font-semibold">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((item) => (
            <tr key={item.id} className="border-b last:border-none">
              <td className="py-4">{item.no}</td>
              <td className="py-4">{item.role}</td>

              {/* STATUS */}
              <td className="py-4">
                <label className="inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.active}
                    onChange={() => toggleStatus(item.id)}
                  />
                  <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-black relative after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-4 after:w-4 after:rounded-full after:transition peer-checked:after:translate-x-4" />
                </label>
              </td>

              {/* ACTION */}
              <td className="py-4">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-gray-200 px-4 py-1 rounded-full text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAdmin(item.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px]">
            <h2 className="font-semibold text-lg mb-4">Tambah Admin</h2>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="No"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Handles by"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={addAdmin}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px]">
            <h2 className="font-semibold text-lg mb-4">Edit Admin</h2>

            <input
              type="text"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm"
              placeholder="Handles by"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={saveEdit}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
