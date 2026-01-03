import { NextResponse } from "next/server";

export async function GET() {
  // nanti isi fetch dari database
  return NextResponse.json({ message: "GET appointment success", data: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  // nanti simpan ke database
  return NextResponse.json({ message: "POST success", body });
}
