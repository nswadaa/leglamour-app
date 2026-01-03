import { NextResponse } from "next/server";

/**
 * SIMULASI DATA LAPORAN
 */
const laporan = [
  {
    id: 1,
    name: "Rania",
    handleBy: "Owner",
    type: "Offline",
    service: "Nail Art",
    tanggal: "2025-11-17",
    jam: "10:00",
    status: "Selesai",
  },
  {
    id: 2,
    name: "Dinda Naswa",
    handleBy: "Staff A",
    type: "Online",
    service: "Manicure",
    tanggal: "2025-11-18",
    jam: "13:00",
    status: "Pending",
  },
];

// GET laporan
export async function GET() {
  return NextResponse.json(laporan);
}
