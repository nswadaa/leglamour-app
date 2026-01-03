import { NextResponse } from "next/server";

/**
 * SIMULASI DATA REVIEW
 * nanti bisa diganti ke MySQL
 */
let reviews = [
  {
    id: 1,
    nama: "Rania",
    gmail: "rania@gmail.com",
    review: "Pelayanannya bagus dan rapi",
  },
  {
    id: 2,
    nama: "Dinda Naswa",
    gmail: "dindanaswa@gmail.com",
    review: "Hasil nail artnya cantik",
  },
];

// GET semua review
export async function GET() {
  return NextResponse.json(reviews);
}

// DELETE review
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  reviews = reviews.filter((r) => r.id !== id);

  return NextResponse.json({
    success: true,
    message: "Review berhasil dihapus",
  });
}
