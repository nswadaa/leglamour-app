import Image from "next/image";

export default function CoursePage() {
  return (
    <main className="w-full h-screen relative">
      {/* PDF */}
      <iframe
        src="/pdf/course.pdf"
        className="w-full h-full border-none"
        title="Course PDF"
      />

      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/6287765221804"
        target="_blank"
        rel="noreferrer noopener"
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center transform hover:scale-105 transition z-50"
        aria-label="Whatsapp"
      >
        <Image
          src="/whatsapp.png"
          width={22}
          height={22}
          alt="whatsapp"
        />
      </a>
    </main>
  );
}
