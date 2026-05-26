import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      {
        error: "Yetkisiz erişim",
        role: session?.user?.role ?? null,
        email: session?.user?.email ?? null,
      },
      { status: 403 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}