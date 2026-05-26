import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

async function releaseExpiredReservations(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET tanımlı değil." },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const { data: expiredOrders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("order_status", "pending")
    .eq("stock_reserved", true)
    .eq("stock_committed", false)
    .eq("stock_released", false)
    .lt("reservation_expires_at", new Date().toISOString());

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  let releasedCount = 0;

  for (const order of expiredOrders ?? []) {
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", order.id);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    for (const item of orderItems ?? []) {
      const { data: stockResult, error: stockError } = await supabaseAdmin.rpc(
        "release_reserved_stock",
        {
          product_id_input: item.product_id,
          quantity_input: Number(item.quantity || 0),
        },
      );

      if (stockError || stockResult?.ok === false) {
        return NextResponse.json(
          {
            error:
              stockResult?.error ??
              stockError?.message ??
              "Süresi dolan rezerv serbest bırakılamadı.",
          },
          { status: 500 },
        );
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        order_status: "cancelled",
        stock_released: true,
      })
      .eq("id", order.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    releasedCount += 1;
  }

  return NextResponse.json({
    ok: true,
    releasedCount,
  });
}

export async function GET(request: Request) {
  return releaseExpiredReservations(request);
}

export async function POST(request: Request) {
  return releaseExpiredReservations(request);
}