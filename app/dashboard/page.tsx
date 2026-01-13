"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type User = {
  id: number;
  name: string;
  phone: string;
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user ?? null);
      } catch (err) {
        console.error("failed to load user", err);
      }
    };

    const loadCartCount = async () => {
      try {
        const res = await fetch("/api/bookings/cart", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        setCartCount(data.items?.length ?? 0);
      } catch (err) {
        console.error("failed to load cart count", err);
      }
    };

    loadUser();
    loadCartCount();
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#333]">
      <main className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <section className="relative w-full">
          <div className="w-full overflow-hidden rounded-b-3xl">
            <Image
              src="/dashboard.png"
              alt="hero nails"
              width={1600}
              height={800}
              className="w-full h-[320px] sm:h-[420px] md:h-[560px] object-cover"
              priority
            />
          </div>

          {/* TRANSPARENT LAYER */}
          <div
            className="absolute inset-4 sm:inset-8 rounded-3xl bg-white/30 border border-white/20 shadow-xl pointer-events-none"
            aria-hidden
          />

          {/* TOP BAR */}
          <div className="absolute left-1/2 -translate-x-1/2 top-6 sm:top-10 w-[92%] sm:w-[86%] md:w-[80%] h-12 sm:h-14 bg-white/85 rounded-full shadow-lg flex items-center justify-between px-4 sm:px-8 backdrop-blur-sm z-20">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Le Glamour logo"
                width={110}
                height={36}
              />
            </div>

            {/* LOGIN / LOGOUT */}
            <div className="flex items-center gap-3">
              {/* CART BUTTON */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full border hover:bg-[#f5f5f5] transition"
              >
                <ShoppingCart className="w-5 h-5 text-[#4e2d15]" />

                {/* BADGE JUMLAH ITEM */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e8e8e8] flex items-center justify-center text-[#4e2d15] font-bold">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="text-[#4e2d15] font-medium text-sm hidden sm:inline">
                    Hai, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-sm border rounded-full text-[#4e2d15] hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/auth/login"
                    className="px-3 py-1 border rounded-full text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/daftar"
                    className="px-3 py-1 border rounded-full text-sm"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="absolute left-4 sm:left-8 md:left-16 top-[40%] sm:top-1/2 -translate-y-1/2 max-w-xs sm:max-w-md md:max-w-lg z-20">
            <h1
              className="font-bold text-[#4e2d15] leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 4.5rem)" }}
            >
              Glow your nails!
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#4e2d15] max-w-md">
              Good nails can make people happy, karena itu Nina, sang perintis
              Le Glamour telah menciptakan pengalaman...
            </p>
          </div>

          {/* SOSMED (responsive position) */}
          <div className="absolute right-4 sm:right-8 md:right-12 top-[18%] sm:top-1/3 flex flex-col gap-3 z-30">
            <a
              href="https://instagram.com/leglamour.nailss"
              target="_blank"
              rel="noreferrer noopener"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center transform hover:scale-105 transition"
              aria-label="Instagram"
            >
              <Image
                src="/instagram.png"
                width={22}
                height={22}
                alt="instagram"
              />
            </a>

            <a
              href="https://wa.me/6287765221804"
              target="_blank"
              rel="noreferrer noopener"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center transform hover:scale-105 transition"
              aria-label="Whatsapp"
            >
              <Image
                src="/whatsapp.png"
                width={22}
                height={22}
                alt="whatsapp"
              />
            </a>

            <a
              href="https://tiktok.com/@leglamour.nailss"
              target="_blank"
              rel="noreferrer noopener"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center transform hover:scale-105 transition"
              aria-label="Tiktok"
            >
              <Image src="/tiktok.png" width={22} height={22} alt="tiktok" />
            </a>

            <a
              href="https://shopee.co.id/leglamournails"
              target="_blank"
              rel="noreferrer noopener"
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center transform hover:scale-105 transition"
              aria-label="Shopee"
            >
              <Image src="/shopee.png" width={22} height={22} alt="shopee" />
            </a>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mt-8 px-4 sm:px-8 md:px-0">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 py-6 sm:px-8 sm:py-10 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 md:gap-10">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {[
                {
                  img: "/nails1.png",
                  title: "Nail and Care",
                  btn: "Book Now",
                  link: "/treatment/nails",
                },
                {
                  img: "/nails2.png",
                  title: "Eyelash Extensions",
                  btn: "Book Now",
                  link: "/treatment/eyelash",
                },
                {
                  img: "/nails3.png",
                  title: "Course",
                  btn: "More",
                  link: "/course",
                },
              ].map((item, i) => (
                <article
                  key={i}
                  className="bg-[#f8f6f4] rounded-xl p-4 flex flex-col items-start gap-3 w-full"
                >
                  <div className="w-full rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.img}
                      width={600}
                      height={400}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>

                  <h3 className="text-[#4e2d15] font-semibold text-base sm:text-lg">
                    {item.title}
                  </h3>

                  <Link href={item.link} className="mt-auto w-full">
                    <button className="w-full px-4 py-2 rounded-full border border-[#d1b8a5] text-[#4e2d15] text-sm">
                      {item.btn}
                    </button>
                  </Link>
                </article>
              ))}
            </div>

            {/* COLOR PALETTE */}
            <aside className="hidden sm:flex flex-col gap-4 justify-center ml-2">
              <div className="w-10 h-10 rounded-full bg-[#c15f33] shadow-md" />
              <div className="w-10 h-10 rounded-full bg-[#d9c1ae] shadow-md" />
              <div className="w-10 h-10 rounded-full bg-[#f3ebe4] shadow-md" />
            </aside>
          </div>
        </section>

        {/* REVIEW + TESTIMONIAL */}
        <section className="px-4 sm:px-8 md:px-0 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-xl mb-4">Write a review</h3>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Nama kamu"
            />

            <label className="block text-sm mb-1">Review</label>
            <textarea
              className="w-full p-3 border rounded-lg mb-4 h-28"
              placeholder="Tulis pengalamanmu..."
            />

            <button className="px-6 py-2 bg-[#4e2d15] text-white rounded-full">
              Submit
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-xl mb-3">Yesss —</h3>
            <p className="text-sm leading-relaxed">
              Good nails can make people happy. Le Glamour hadir untuk
              menciptakan pengalaman perawatan kuku & kecantikan yang hangat dan
              profesional.
            </p>

            {/* example short testimonials */}
            <div className="mt-6 space-y-3">
              <blockquote className="text-sm p-3 bg-[#f8f6f4] rounded-lg">
                "Pelayanan ramah dan hasilnya bagus!" — Rina
              </blockquote>
              <blockquote className="text-sm p-3 bg-[#f8f6f4] rounded-lg">
                "Rekomendasi warna sesuai trend." — Anita
              </blockquote>
            </div>
          </div>
        </section>

        {/* MAP + OUTLET */}
        <section className="mt-8 px-4 sm:px-8 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden">
            <a
              href="https://maps.app.goo.gl/Lr2fPv1v9p29FHJfA"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Map to outlet"
            >
              <Image
                src="/map.png"
                alt="map location"
                width={1200}
                height={800}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow"
              />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-semibold text-lg text-[var(--grey)]">
              Le Glamour Stores
            </h3>
            <h4 className="mt-2 text-2xl md:text-4xl font-semibold text-[#4e2d15]">
              Outlet Karangwaru
            </h4>

            <h3 className="mt-6 font-semibold text-sm text-[var(--grey)]">
              Address
            </h3>
            <p className="mt-2 text-sm md:text-base">
              Jl. Dr. Sutomo VIII Ruko KFC (Karangwaru Futsal Center. 83,
              Karangwaru, Kec. Tulungagung, Kabupaten Tulungagung, Jawa Timur
              66217)
            </p>

            <div className="mt-6 flex gap-3">
              <a
                className="inline-block px-4 py-2 border rounded-full text-sm"
                href="https://maps.app.goo.gl/Lr2fPv1v9p29FHJfA"
                target="_blank"
                rel="noreferrer noopener"
              >
                Lihat di Maps
              </a>
              <a
                className="inline-block px-4 py-2 bg-[#4e2d15] text-white rounded-full text-sm"
                href="https://wa.me/6287765221804"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-14 mb-8 px-4 sm:px-8">
          <div className="bg-[#d9c1ae] rounded-2xl py-10 px-6 text-[#4e2d15]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* BRAND + DESC */}
              <div>
                <h4 className="text-xl font-semibold">LeGlamour.idn</h4>
                <p className="mt-3 text-sm leading-relaxed">
                  Jasa nail art & beauty care profesional yang menghadirkan
                  pengalaman perawatan nyaman, bersih, dan mengikuti tren
                  terkini.
                </p>

                {/* SOSMED */}
                <div className="mt-4 flex gap-3">
                  <a
                    href="https://instagram.com/leglamour.nailss"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                    aria-label="Instagram"
                  >
                    <Image
                      src="/instagram.png"
                      width={18}
                      height={18}
                      alt="instagram"
                    />
                  </a>

                  <a
                    href="https://tiktok.com/@leglamour.nailss"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                    aria-label="Tiktok"
                  >
                    <Image
                      src="/tiktok.png"
                      width={18}
                      height={18}
                      alt="tiktok"
                    />
                  </a>

                  <a
                    href="https://wa.me/6287765221804"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                    aria-label="Whatsapp"
                  >
                    <Image
                      src="/whatsapp.png"
                      width={18}
                      height={18}
                      alt="whatsapp"
                    />
                  </a>

                  <a
                    href="https://shopee.co.id/leglamournails"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow hover:scale-110 transition"
                    aria-label="Shopee"
                  >
                    <Image
                      src="/shopee.png"
                      width={18}
                      height={18}
                      alt="shopee"
                    />
                  </a>
                </div>
              </div>

              {/* SERVICES */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Services</h4>
                <ul className="text-sm space-y-2">
                  <li>• Nail & Care</li>
                  <li>• Eyelash Extensions</li>
                  <li>• Nail Course</li>
                </ul>
              </div>

              {/* CABANG */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Cabang</h4>
                <p className="text-sm leading-relaxed">
                  Outlet Karangwaru <br />
                  Tulungagung, Jawa Timur
                </p>

                <a
                  href="https://maps.app.goo.gl/RUzfEncoqAcRrkx19"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block mt-3 text-sm underline"
                >
                  Lihat di Google Maps
                </a>
              </div>

              {/* GOOGLE MAPS */}
              <div className="rounded-xl overflow-hidden shadow-sm h-[220px] md:h-[260px]">
                <iframe
                  title="Outlet Karangwaru"
                  src="https://www.google.com/maps?q=Outlet%20Karangwaru%20Tulungagung&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-10 border-t border-[#cbb09c] pt-4 text-center text-sm opacity-80">
              © {new Date().getFullYear()} LeGlamour. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
