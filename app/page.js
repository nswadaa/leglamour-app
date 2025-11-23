export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3efe9] text-[#2e2a27]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* NAVBAR */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#efe7e0] flex items-center justify-center font-medium text-lg">LG</div>
            <span className="text-xl font-semibold tracking-wide">Le Glamour</span>
          </div>

          <nav className="flex items-center gap-4">
            <button className="px-5 py-2 rounded-full bg-white/80 shadow-sm">Login / Daftar</button>
            <button className="px-3 py-2 rounded-full bg-[#f0ebe7]">☰</button>
          </nav>
        </header>

        {/* HERO WRAPPER (card like) */}
        <section className="relative mt-6">
          <div className="rounded-3xl overflow-hidden bg-white shadow-xl">
            {/* background image */}
            <div
              className="relative h-[420px] bg-center bg-cover"
              style={{ backgroundImage: "url('/nail-hero.png')" }}
            >
              {/* translucent overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80"></div>

              {/* hero content (right) */}
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="max-w-md ml-10 mt-8">
                  <h1 className="text-5xl font-bold leading-tight text-[#633b2b] drop-shadow-sm">
                    Glow your nails!
                  </h1>
                  <p className="mt-4 text-gray-700">
                    Good nails can make people happy. Nina, pendiri LeGlamour, menciptakan pengalaman perawatan kuku dan bulu mata yang memukau.
                  </p>

                  <div className="mt-6 flex gap-4">
                    <button className="px-6 py-3 rounded-full bg-[#b77a52] text-white shadow-md">Book Now</button>
                    <button className="px-6 py-3 rounded-full bg-white border border-gray-200">Belanja Semua Barang</button>
                  </div>
                </div>
              </div>

              {/* small floating social icons (right) */}
              <div className="absolute right-6 top-1/3 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">WA</div>
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">IG</div>
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">T</div>
              </div>
            </div>

            {/* below hero card: services / buttons */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#fff] rounded-2xl p-4 shadow flex flex-col">
                  <img src="/service-nail.jpg" alt="nail" className="h-36 w-full object-cover rounded-lg" />
                  <h3 className="mt-4 font-semibold">Nail and Care</h3>
                  <p className="text-sm text-gray-600 mt-2">Perawatan kuku & nail art profesional.</p>
                  <button className="mt-4 self-start px-4 py-2 rounded-full bg-[#b77a52] text-white">Book Now</button>
                </div>

                <div className="bg-[#fff] rounded-2xl p-4 shadow flex flex-col">
                  <img src="/service-eyelash.jpg" alt="lash" className="h-36 w-full object-cover rounded-lg" />
                  <h3 className="mt-4 font-semibold">Eyelash Extensions</h3>
                  <p className="text-sm text-gray-600 mt-2">Lash extension natural & full set.</p>
                  <button className="mt-4 self-start px-4 py-2 rounded-full bg-[#b77a52] text-white">Book Now</button>
                </div>

                <div className="bg-[#fff] rounded-2xl p-4 shadow flex flex-col">
                  <img src="/service-course.jpg" alt="course" className="h-36 w-full object-cover rounded-lg" />
                  <h3 className="mt-4 font-semibold">Course</h3>
                  <p className="text-sm text-gray-600 mt-2">Kelas belajar nail art & eyelash.</p>
                  <button className="mt-4 self-start px-4 py-2 rounded-full bg-[#b77a52] text-white">More</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEW + TESTIMONIALS */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow">
            <h4 className="font-semibold mb-4">Write a review</h4>
            <form className="flex flex-col gap-3">
              <input className="border border-gray-200 rounded-md p-3" placeholder="Name" />
              <input className="border border-gray-200 rounded-md p-3" placeholder="Email" />
              <textarea className="border border-gray-200 rounded-md p-3 h-28" placeholder="Your review"></textarea>
              <button className="mt-2 px-4 py-2 rounded-full bg-[#b77a52] text-white w-32">Submit</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h4 className="font-semibold mb-4">Testimonial</h4>
            <div className="text-sm text-gray-700">
              <p className="mb-3">“Good nails can make people happy. Pelayanan ramah & hasil rapi.”</p>
              <p className="text-xs text-gray-500">— Nina, LeGlamour customer</p>
            </div>
          </div>
        </section>

        {/* MAP + ADDRESS */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 bg-white rounded-2xl p-4 shadow">
            <iframe
              title="map"
              className="w-full h-64 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18"
              loading="lazy"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <h5 className="font-semibold mb-2">Le Glamour Stores</h5>
            <p className="text-sm text-gray-600">
              Outlet Karangwaru<br />
              Jl. Dr. Sutomo VII Ruko KFC (Karangwaru)
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 py-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Le Glamour — All rights reserved</p>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-[#d9cfc6]" />
              <span className="w-8 h-8 rounded-full bg-[#b87b46]" />
              <span className="w-8 h-8 rounded-full bg-[#e7e3df]" />
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
