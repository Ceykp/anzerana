import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);

  const sessionEmail = normalizeEmail(session?.user?.email);
  const queryEmail = normalizeEmail(url.searchParams.get("email"));

  const email = sessionEmail || queryEmail;

  if (!email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id,
      order_code,
      customer_name,
      customer_email,
      customer_phone,
      shipping_city,
      shipping_district,
      total,
      payment_status,
      order_status,
      cargo_company,
      cargo_tracking_code,
      cargo_tracking_url,
      cargo_status,
      cargo_created_at,
      cargo_delivered_at,
      created_at
      `,
    )
    .eq("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    orders: orders ?? [],
  });
}