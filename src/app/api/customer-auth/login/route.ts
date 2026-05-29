import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export async function POST(request: Request) {
  const body = await request.json();

  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "").trim();

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-posta ve şifre alanları zorunludur." },
      { status: 400 },
    );
  }

  const { data: user, error } = await supabaseAdmin
    .from("customer_accounts")
    .select("id, name, email, password_hash, provider, created_at")
    .eq("email", email)
    .eq("provider", "email")
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı." },
      { status: 401 },
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      createdAt: user.created_at,
    },
  });
}