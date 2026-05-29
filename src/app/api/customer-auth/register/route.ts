import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name ?? "").trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? "").trim();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Lütfen tüm alanları doldurun." },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta adresi girin." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Şifre en az 6 karakter olmalıdır." },
      { status: 400 },
    );
  }

  const { data: existingUser } = await supabaseAdmin
    .from("customer_accounts")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json(
      { error: "Bu e-posta adresiyle kayıtlı bir hesap var." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabaseAdmin
    .from("customer_accounts")
    .insert({
      name,
      email,
      password_hash: passwordHash,
      provider: "email",
      role: "customer",
    })
    .select("id, name, email, provider, created_at")
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: error?.message ?? "Kayıt oluşturulamadı." },
      { status: 500 },
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