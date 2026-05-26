import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const orderCode = String(body.orderCode ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!orderCode || !phone) {
    return NextResponse.json(
      { error: "Sipariş numarası ve telefon zorunludur." },
      { status: 400 },
    );
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_code, customer_name, customer_phone, shipping_city, shipping_district, total, payment_status, order_status, cargo_company, cargo_tracking_code, cargo_tracking_url, created_at",
    )
    .eq("order_code", orderCode)
    .eq("customer_phone", phone)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json(
      { error: "Bu bilgilerle eşleşen sipariş bulunamadı." },
      { status: 404 },
    );
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("product_name, variant_label, quantity, line_total")
    .eq("order_id", order.id);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    order,
    items: items ?? [],
  });
}