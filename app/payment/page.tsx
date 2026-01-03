// "use client";

// import { ChangeEvent, useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function PaymentPage() {
//   const router = useRouter();
//   const params = useSearchParams();

//     const fixDate = (d: string) => {
//     const [day, month, year] = d.split("-");
//     return `${year}-${month}-${day}`; // 2025-12-15
//   };

//   const fixTime = (t: string) => {
//     return t.replace(".", ":") + ":00"; // 12:00:00
//   };

//   const service = params.get("serviceId");
//   const staff = params.get("staffId");
//   const date = params.get("date");
//   const time = params.get("time");
//   const [bookingId, setBookingId] = useState<number | null>(null);


//   // DP tetap 20.000
//   const dp = 20000;

//   const [uploadPreview, setUploadPreview] = useState<string | null>(null);
//   const [fileData, setFileData] = useState<File | null>(null);

//   // 🔒 Kunci DP di URL agar user tidak bisa modifikasi manual
//   useEffect(() => {
//     const url = new URL(window.location.href);
//     url.searchParams.set("dp", String(dp));
//     window.history.replaceState(null, "", url.toString());
//   }, []);

// const handleSubmit = async () => {
//   if (!fileData) return alert("Harap upload bukti pembayaran.");

//   // 1. CREATE BOOKING
//   const bookingRes = await fetch("/api/bookings/create", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId: 1,
//       serviceId: parseInt(service as string),
//       staffId: parseInt(staff as string),
//       date: fixDate(date as string),
//       time: fixTime(time as string),
//     }),
//   });

//   const bookingJson = await bookingRes.json();
//   if (!bookingRes.ok) {
//     alert("Gagal membuat booking: " + bookingJson.error);
//     return;
//   }

//   const bookingId = bookingJson.bookingId;
//   console.log("📌 Booking ID final:", bookingId);

//   // 2. UPLOAD FILE → dapat proofUrl
//   const fd = new FormData();
//   fd.append("file", fileData);

//   const uploadRes = await fetch("/api/payments/upload-file", {
//     method: "POST",
//     body: fd,
//   });

//   const uploadJson = await uploadRes.json();
//   if (!uploadRes.ok) {
//     alert("Gagal upload gambar");
//     return;
//   }

//   const proofUrl = uploadJson.url;
//   console.log("📌 proofUrl:", proofUrl);

//   // 3. KIRIM KE /api/payments/upload (BUTUH bookingId + proofUrl)
//   const paymentRes = await fetch("/api/payments/upload", {
//     method: "POST",
//     body: (() => {
//       const fd = new FormData();
//       fd.append("bookingId", bookingId.toString());
//       fd.append("proofUrl", proofUrl);
//       return fd;
//     })(),
//   });

//   const paymentJson = await paymentRes.json();
//   if (!paymentRes.ok) {
//     alert(paymentJson.error);
//     return;
//   }

//   // 4. REDIRECT
//   router.push(`/booking-receipt?id=${bookingId}`);
// };


//   // function handleUpload(event: ChangeEvent<HTMLInputElement>): void {
//   //   throw new Error("Function not implemented.");
//   // }

//   async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
//   try {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     // 1. Upload file ke /api/payments/upload-file
//     const fileForm = new FormData();
//     fileForm.append("file", file);

//     const uploadRes = await fetch("/api/payments/upload-file", {
//       method: "POST",
//       body: fileForm,
//     });

//     const uploadJson = await uploadRes.json();
//     if (!uploadRes.ok) {
//       alert(uploadJson.error || "Upload gagal");
//       return;
//     }

//     const proofUrl = uploadJson.url;

//     // 2. Kirim bookingId + proofUrl ke /api/payments/upload
//     const fd = new FormData();
//     fd.append("bookingId", bookingId.toString());
//     fd.append("proofUrl", proofUrl);

//     const payRes = await fetch("/api/payments/upload", {
//       method: "POST",
//       body: fd,
//     });

//     const payJson = await payRes.json();

//     if (!payRes.ok) {
//       alert(payJson.error || "Gagal submit bukti");
//       return;
//     }

//     alert("Bukti pembayaran berhasil dikirim!");

//   } catch (err) {
//     console.error("Upload Error:", err);
//     alert("Terjadi kesalahan upload");
//   } finally {
//     setLoading(false);
//   }
// }


//   return (
//     <div className="w-full px-8 py-10 select-none">
//       <span
//         onClick={() => router.back()}
//         className="cursor-pointer text-sm"
//       >
//         ‹ Kembali
//       </span>

//       <h2 className="text-2xl font-semibold mt-2">
//         PAYMENT FOR YOUR BOOK
//       </h2>

//       <div className="flex flex-col lg:flex-row gap-10 mt-6">
//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-5">

//           {/* SERVICE AREA */}
//           <div className="border rounded-xl p-4 mb-4 text-[15px]">
//             <p className="font-semibold">Service:</p>
//             <p>{service || "Tidak ada data service"}</p>
//           </div>

//           {/* STAFF AREA */}
//           <div className="border rounded-xl p-4 mb-4 text-[15px]">
//             <p className="font-semibold">Staff:</p>
//             <p>{staff || "Tidak ada data staff"}</p>
//           </div>

//           {/* DATE AREA */}
//           <div className="border rounded-xl p-4 mb-4 text-[15px]">
//             <p className="font-semibold">Tanggal:</p>
//             <p>{date || "Tidak ada data tanggal"}</p>
//           </div>

//           {/* TIME AREA */}
//           <div className="border rounded-xl p-4 mb-4 text-[15px]">
//             <p className="font-semibold">Waktu:</p>
//             <p>{time || "Tidak ada data waktu"}</p>
//           </div>

//           {/* DP PRICE */}
//           <div className="border rounded-xl p-4 mb-4 flex justify-between">
//             <span className="font-semibold">Total DP</span>
//             <span className="font-semibold">
//               Rp {dp.toLocaleString("id-ID")}
//             </span>
//           </div>

//           {/* UPLOADER */}
//           <div className="border rounded-xl p-4 mb-4 text-center">
//             <p className="text-xs mb-2 text-gray-500">
//               Upload bukti pembayaran
//             </p>

//             <label className="cursor-pointer">
//               <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center">
//                 {uploadPreview ? (
//                   <img
//                     src={uploadPreview}
//                     className="h-full object-contain"
//                   />
//                 ) : (
//                   <img
//                     src="/upload-icon.png"
//                     className="w-8 opacity-40"
//                   />
//                 )}
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleUpload}
//               />
//             </label>
//           </div>

//           {/* DETAIL */}
//           <div className="border rounded-xl p-4">
//             <h4 className="font-semibold mb-1">Detail</h4>
//             <p className="text-sm text-gray-600">
//               Jika ada tambahan desain pada nails, maka akan dikenai biaya tambahan
//               yang dibayar di studio LeGlamour.
//             </p>
//           </div>

//           {/* BUTTON */}
//           <button
//             className="mt-6 w-full bg-[#8A4B20] text-white py-3 rounded-xl"
//             onClick={handleSubmit}
//           >
//             KIRIM BUKTI PEMBAYARAN
//           </button>
//         </div>

//         {/* QRIS */}
//         <div className="w-full lg:w-1/2 flex justify-center">
//           <img
//             src="/qris.png"
//             alt="QRIS"
//             className="w-[350px] rounded-xl shadow object-contain"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// function setLoading(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }

"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  const fixDate = (d: string) => {
    const [day, month, year] = d.split("-");
    return `${year}-${month}-${day}`;
  };

  const fixTime = (t: string) => {
    return t.replace(".", ":") + ":00";
  };

  const service = params.get("serviceId");
  const staff = params.get("staffId");
  const date = params.get("date");
  const time = params.get("time");

  const dp = 20000;

  // STATES
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Lock DP in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("dp", String(dp));
    window.history.replaceState(null, "", url.toString());
  }, []);

  // ------------------------------
  // ON FILE SELECT
  // ------------------------------
  const onFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileData(f);
      setUploadPreview(URL.createObjectURL(f));
    }
  };

  // ------------------------------
  // SUBMIT FINAL
  // ------------------------------
  const handleSubmit = async () => {
    if (!fileData) {
      alert("Harap upload bukti pembayaran.");
      return;
    }

    try {
      setLoading(true);

      // STEP 1 — Create booking
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          serviceId: Number(service),
          staffId: Number(staff),
          date: fixDate(date as string),
          time: fixTime(time as string),
        }),
      });

      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok) {
        alert("Gagal membuat booking: " + bookingJson.error);
        return;
      }

      const bookingId = bookingJson.bookingId;
      console.log("📌 bookingId:", bookingId);

      // STEP 2 — Upload image → get proofUrl
      const fd = new FormData();
      fd.append("file", fileData);

      const uploadRes = await fetch("/api/payments/upload-file", {
        method: "POST",
        body: fd,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) {
        alert("Upload bukti pembayaran gagal");
        return;
      }

      const proofUrl = uploadJson.url;
      console.log("📌 proofUrl:", proofUrl);

      // STEP 3 — Submit bookingId + proofUrl
      const payData = new FormData();
      payData.append("bookingId", bookingId.toString());
      payData.append("proofUrl", proofUrl);

      const paymentRes = await fetch("/api/payments/upload", {
        method: "POST",
        body: payData,
      });

      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok) {
        alert(paymentJson.error);
        return;
      }

      // STEP 4 — Redirect
      router.push(`/booking-receipt?id=${bookingId}`);
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Terjadi kesalahan saat mengirim pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // RENDER PAGE
  // ------------------------------
  return (
    <div className="w-full px-8 py-10 select-none">
      <span onClick={() => router.back()} className="cursor-pointer text-sm">
        ‹ Kembali
      </span>

      <h2 className="text-2xl font-semibold mt-2">
        PAYMENT FOR YOUR BOOK
      </h2>

      <div className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* LEFT */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-5">
          {/* SERVICE */}
          <div className="border rounded-xl p-4 mb-4 text-[15px]">
            <p className="font-semibold">Service:</p>
            <p>{service || "Tidak ada data service"}</p>
          </div>

          {/* STAFF */}
          <div className="border rounded-xl p-4 mb-4 text-[15px]">
            <p className="font-semibold">Staff:</p>
            <p>{staff || "Tidak ada data staff"}</p>
          </div>

          {/* DATE */}
          <div className="border rounded-xl p-4 mb-4 text-[15px]">
            <p className="font-semibold">Tanggal:</p>
            <p>{date || "Tidak ada data tanggal"}</p>
          </div>

          {/* TIME */}
          <div className="border rounded-xl p-4 mb-4 text-[15px]">
            <p className="font-semibold">Waktu:</p>
            <p>{time || "Tidak ada data waktu"}</p>
          </div>

          {/* DP */}
          <div className="border rounded-xl p-4 mb-4 flex justify-between">
            <span className="font-semibold">Total DP</span>
            <span className="font-semibold">
              Rp {dp.toLocaleString("id-ID")}
            </span>
          </div>

          {/* UPLOADER */}
          <div className="border rounded-xl p-4 mb-4 text-center">
            <p className="text-xs mb-2 text-gray-500">
              Upload bukti pembayaran
            </p>

            <label className="cursor-pointer">
              <div className="w-full h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                {uploadPreview ? (
                  <img src={uploadPreview} className="h-full object-contain" />
                ) : (
                  <img src="/upload-icon.png" className="w-8 opacity-40" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFilePick}
              />
            </label>
          </div>

          {/* DETAIL */}
          <div className="border rounded-xl p-4">
            <h4 className="font-semibold mb-1">Detail</h4>
            <p className="text-sm text-gray-600">
              Jika ada tambahan desain pada nails, maka akan dikenai biaya
              tambahan yang dibayar di studio LeGlamour.
            </p>
          </div>

          {/* BUTTON */}
          <button
            className="mt-6 w-full bg-[#8A4B20] text-white py-3 rounded-xl"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Mengirim..." : "KIRIM BUKTI PEMBAYARAN"}
          </button>
        </div>

        {/* QRIS */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="/qris.png"
            alt="QRIS"
            className="w-[350px] rounded-xl shadow object-contain"
          />
        </div>
      </div>
    </div>
  );
}
