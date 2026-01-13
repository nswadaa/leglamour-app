"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  date: string;
  time: string;
  serviceName: string | null;
  staffName?: string | null;
  expiresAt?: string | null; // ⬅️ TAMBAH INI
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadCart = async () => {
    const res = await fetch("/api/bookings/cart", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadCart();
    }, 10_000); // ⏱️ 30 detik (AMAN)

    return () => clearInterval(interval);
  }, []);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const checkout = async () => {
    if (!confirm("Lanjutkan checkout booking?")) return;

    const res = await fetch("/api/bookings/checkout", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Booking berhasil! Silakan lanjut pembayaran.");
    router.push("/payment");
  };

  const removeItem = async (id: number) => {
    await fetch("/api/bookings/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadCart();
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Keranjang Booking</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Keranjang masih kosong</p>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          let remaining = 0;
          let minutes = 0;
          let seconds = 0;

          if (item.expiresAt) {
            remaining = new Date(item.expiresAt).getTime() - Date.now();

            const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
          }

          return (
            <div
              key={item.id}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {item.serviceName ?? "Unknown Service"}
                </p>

                {item.staffName && (
                  <p className="text-sm text-gray-500">
                    Handled by: {item.staffName}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  {item.date} • {item.time}
                </p>

                {item.expiresAt && remaining > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    ⏱ Hold expires in {minutes}:
                    {String(seconds).padStart(2, "0")}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          );
        })}
      </div>

      {items.length > 0 && (
        <button
          onClick={checkout}
          disabled={loading}
          className="mt-8 w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          Checkout Booking
        </button>
      )}
    </div>
  );
}
