"use client";

import { useState } from "react";

type Treatment = {
  id: number;
  no: number;
  name: string;
  category: "Eyelash" | "Nail Art";
  active: boolean;
};

export default function EditTreatmentPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([
    { id: 1, no: 1, name: "Manicure", category: "Nail Art", active: true },
    { id: 2, no: 2, name: "Pedicure", category: "Nail Art", active: true },
    { id: 3, no: 3, name: "Volume Lash", category: "Eyelash", active: false },
  ]);

  /* ================= ADD STATE ================= */
  const [open, setOpen] = useState(false);
  const [no, setNo] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Eyelash" | "Nail Art">("Nail Art");

  /* ================= EDIT STATE ================= */
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const addTreatment = () => {
    if (!no || !name) return;

    setTreatments([
      ...treatments,
      {
        id: Date.now(),
        no: Number(no),
        name,
        category,
        active: true,
      },
    ]);

    setNo("");
    setName("");
    setCategory("Nail Art");
    setOpen(false);
  };

  const openEdit = (item: Treatment) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editId || !editName) return;

    setTreatments((prev) =>
      prev.map((item) =>
        item.id === editId ? { ...item, name: editName } : item
      )
    );

    setEditOpen(false);
    setEditId(null);
    setEditName("");
  };

  const deleteTreatment = (id: number) => {
    setTreatments(treatments.filter((item) => item.id !== id));
  };

  const toggleStatus = (id: number) => {
    setTreatments(
      treatments.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const changeCategory = (id: number, value: "Eyelash" | "Nail Art") => {
    setTreatments(
      treatments.map((item) =>
        item.id === id ? { ...item, category: value } : item
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
          + Add Treatment
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b">
            <th className="py-3">No</th>
            <th className="py-3">Treatment</th>
            <th className="py-3">Pilihan</th>
            <th className="py-3">Status</th>
            <th className="py-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {treatments.map((item) => (
            <tr key={item.id} className="border-b last:border-none">
              <td className="py-4">{item.no}</td>
              <td className="py-4">{item.name}</td>

              <td className="py-4">
                <select
                  value={item.category}
                  onChange={(e) =>
                    changeCategory(
                      item.id,
                      e.target.value as "Eyelash" | "Nail Art"
                    )
                  }
                  className="border rounded-full px-4 py-1 text-sm"
                >
                  <option value="Eyelash">Eyelash</option>
                  <option value="Nail Art">Nail Art</option>
                </select>
              </td>

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

              <td className="py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-gray-200 px-4 py-1 rounded-full text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTreatment(item.id)}
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
          <div className="bg-white rounded-2xl p-6 w-[360px]">
            <h2 className="font-semibold mb-4">Tambah Treatment</h2>

            <div className="space-y-3">
              <input
                type="number"
                placeholder="No Treatment"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Nama Treatment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 text-sm"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "Eyelash" | "Nail Art")
                }
                className="w-full border rounded-lg px-4 py-2 text-sm"
              >
                <option value="Eyelash">Eyelash</option>
                <option value="Nail Art">Nail Art</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={addTreatment}
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
          <div className="bg-white rounded-2xl p-6 w-[360px]">
            <h2 className="font-semibold mb-4">Edit Treatment</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm"
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
