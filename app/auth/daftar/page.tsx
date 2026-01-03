"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DaftarPage() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const submit = async () => {
    if (!form.name || !form.phone || !form.password) {
      setMsg("Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    setMsg("Loading...");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const text = await res.text();
    setMsg(text);
    setLoading(false);

    if (res.ok) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/background.png')] bg-cover bg-center">
      <div className="w-[380px] bg-white/50 backdrop-blur-md shadow-xl rounded-2xl p-8 text-center border border-gray-300 relative">

        {/* 🔙 Tombol Kembali */}
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 top-4 text-gray-800 text-sm px-3 py-1 rounded-full bg-white/70 hover:bg-white transition"
        >
          ← Kembali
        </button>

        <h1 className="text-xl font-semibold mb-2 tracking-wide mt-8">DAFTAR</h1>

        <p className="text-xs text-gray-600 mb-6">
          Isi data dengan benar untuk membuat akun.<br />
          Simpan Username dan Password untuk login.<br />
        </p>

        {/* Nama */}
        <input
          placeholder="Nama"
          className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm outline-none mb-3 focus:ring-2 focus:ring-gray-400"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Password Dengan Icon Show/Hide */}
        <div className="relative mb-3">
          <input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-gray-400 pr-10"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Icon Mata */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPass ? (
              // Mata terbuka
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              // Mata tertutup
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 013.422-4.927M6.18 6.18A9.959 9.959 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.043 5.225M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>

        {/* No HP */}
        <input
          placeholder="No. HP"
          className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm outline-none mb-4 focus:ring-2 focus:ring-gray-400"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button
          disabled={loading}
          onClick={submit}
          className="w-full bg-gray-700 text-white py-2 mt-2 rounded-full tracking-widest hover:bg-black transition disabled:opacity-50"
        >
          {loading ? "MENDAFTAR..." : "DAFTAR"}
        </button>

        <p className="text-[11px] text-gray-600 mt-4">
          Sudah punya akun? <a href="/auth/login" className="text-gray-900 underline">Login</a>
        </p>

        {msg && <p className="text-sm text-gray-900 font-medium mt-3">{msg}</p>}
      </div>
    </div>
  );
}
