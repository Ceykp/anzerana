import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;

  const filePath = `products/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
        console.error("UPLOAD ERROR:", error);
      
        return NextResponse.json(
          { error: error.message },
          { status: 500 },
        );
      }

  const { data } = supabaseAdmin.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return NextResponse.json({
    url: data.publicUrl,
  });
}