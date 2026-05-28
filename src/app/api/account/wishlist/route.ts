import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export async function GET() {
  const session = await auth();
  const email = normalizeEmail(session?.user?.email);

  if (!email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("customer_wishlists")
    .select("ids")
    .eq("customer_email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ids: data?.ids ?? [],
  });
}

export async function POST(request: Request) {
  const session = await auth();
  const email = normalizeEmail(session?.user?.email);

  if (!email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const body = await request.json();
  const ids = Array.isArray(body.ids) ? body.ids : [];

  const { error } = await supabaseAdmin.from("customer_wishlists").upsert(
    {
      customer_email: email,
      ids,
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

export async function DELETE() {
  const session = await auth();
  const email = normalizeEmail(session?.user?.email);

  if (!email) {
    return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("customer_wishlists")
    .delete()
    .eq("customer_email", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}