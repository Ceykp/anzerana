import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { data: address, error } = await supabaseAdmin
    .from("customer_addresses")
    .select("*")
    .eq("customer_email", session.user.email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    address: address ?? null,
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const body = await request.json();

  const customerName = String(body.customerName ?? "").trim();
  const customerPhone = String(body.customerPhone ?? "").trim();
  const shippingCity = String(body.shippingCity ?? "").trim();
  const shippingDistrict = String(body.shippingDistrict ?? "").trim();
  const shippingAddress = String(body.shippingAddress ?? "").trim();

  if (
    !customerName ||
    !customerPhone ||
    !shippingCity ||
    !shippingDistrict ||
    !shippingAddress
  ) {
    return NextResponse.json(
      { error: "Adres bilgileri eksik." },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin.from("customer_addresses").upsert(
    {
      customer_email: session.user.email,
      customer_name: customerName,
      customer_phone: customerPhone,
      shipping_city: shippingCity,
      shipping_district: shippingDistrict,
      shipping_address: shippingAddress,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "customer_email",
    },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}