import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(uploadPath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", detail: String(err) },
      { status: 500 }
    );
  }
}
