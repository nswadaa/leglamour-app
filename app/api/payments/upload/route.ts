// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { payments, bookings } from "@/drizzle/schema";
// import { eq } from "drizzle-orm";

// export async function POST(req: Request) {
//   try {
//     console.log("🔥 HIT /api/payments/upload");

//     const body = await req.json();
//     console.log("📩 BODY RECEIVED:", body);

//     const bookingId = Number(body.bookingId);
//     const proofUrl = body.proofUrl;

//     console.log("📌 bookingId (parsed):", bookingId);
//     console.log("📌 proofUrl:", proofUrl);

//     if (!bookingId || !proofUrl) {
//       return NextResponse.json(
//         { error: "Bukti pembayaran wajib diupload" },
//         { status: 400 }
//       );
//     }

//     // Cek payment
//     const existing = await db
//       .select()
//       .from(payments)
//       .where(eq(payments.bookingId, bookingId));

//     console.log("📌 Existing payment:", existing);

//     if (existing.length === 0) {
//       console.log("➡️ INSERT payment");

//       await db.insert(payments).values({
//         bookingId,
//         method: "manual",
//         amount: 20000,
//         paymentStatus: "waiting_approval",
//         transactionId: proofUrl,
//       });
//     } else {
//       console.log("➡️ UPDATE payment");

//       await db
//         .update(payments)
//         .set({
//           paymentStatus: "waiting_approval",
//           transactionId: proofUrl,
//         })
//         .where(eq(payments.bookingId, bookingId));
//     }

//     console.log("➡️ UPDATE booking status");

//     await db
//       .update(bookings)
//       .set({ status: "waiting_approval" })
//       .where(eq(bookings.id, bookingId));

//     console.log("✔️ SUCCESS FULLY UPDATED");

//     return NextResponse.json({
//       message: "Bukti pembayaran berhasil diupload, menunggu verifikasi admin",
//     });

//   } catch (err) {
//     console.error("❌ ERROR IN /api/payments/upload:", err);
//     return NextResponse.json(
//       { error: "Server error", detail: String(err) },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments, bookings } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    console.log("🔥 HIT /api/payments/upload");

    // ⬅️ FIX: gunakan FormData, bukan JSON
    const formData = await req.formData();

    const bookingId = Number(formData.get("bookingId"));
    const proofUrl = formData.get("proofUrl") as string;

    console.log("📌 bookingId:", bookingId);
    console.log("📌 proofUrl:", proofUrl);

    if (!bookingId || !proofUrl) {
      return NextResponse.json(
        { error: "Bukti pembayaran wajib diupload" },
        { status: 400 }
      );
    }

    // Cek payment
    const existing = await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingId));

    console.log("📌 Existing payment:", existing);

    if (existing.length === 0) {
      console.log("➡️ INSERT payment");

      await db.insert(payments).values({
        bookingId,
        method: "manual",
        amount: 20000,
        paymentStatus: "waiting_approval",
        transactionId: proofUrl,
      });
    } else {
      console.log("➡️ UPDATE payment");

      await db
        .update(payments)
        .set({
          paymentStatus: "waiting_approval",
          transactionId: proofUrl,
        })
        .where(eq(payments.bookingId, bookingId));
    }

    console.log("➡️ UPDATE booking status");

    await db
      .update(bookings)
      .set({ status: "waiting_approval" })
      .where(eq(bookings.id, bookingId));

    console.log("✔️ SUCCESS FULLY UPDATED");

    return NextResponse.json({
      message: "Bukti pembayaran berhasil diupload, menunggu verifikasi admin",
    });

  } catch (err) {
    console.error("❌ ERROR IN /api/payments/upload:", err);
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 }
    );
  }
}
