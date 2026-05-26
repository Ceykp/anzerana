import { auth } from "@/auth";
import { sendCargoNotificationEmail } from "@/lib/cargo-email";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Sipariş bulunamadı." },
      { status: 404 },
    );
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    order,
    items: items ?? [],
  });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const nextOrderStatus = body.order_status;
  const nextPaymentStatus = body.payment_status;
  const nextCargoStatus = body.cargo_status ?? "not_shipped";

  const { data: currentOrder, error: currentOrderError } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_code, customer_name, customer_email, order_status, payment_status, stock_reserved, stock_committed, stock_released, cargo_status, cargo_created_at, cargo_delivered_at",
    )
    .eq("id", id)
    .single();

  if (currentOrderError || !currentOrder) {
    return NextResponse.json(
      { error: currentOrderError?.message ?? "Sipariş bulunamadı." },
      { status: 404 },
    );
  }

  const { data: orderItems, error: orderItemsError } = await supabaseAdmin
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", id);

  if (orderItemsError) {
    return NextResponse.json({ error: orderItemsError.message }, { status: 500 });
  }

  let stockReserved = Boolean(currentOrder.stock_reserved);
  let stockCommitted = Boolean(currentOrder.stock_committed);
  let stockReleased = Boolean(currentOrder.stock_released);

  const shouldCommitStock =
    stockReserved &&
    !stockCommitted &&
    !stockReleased &&
    (nextOrderStatus === "confirmed" ||
      nextOrderStatus === "preparing" ||
      nextOrderStatus === "shipped" ||
      nextOrderStatus === "completed" ||
      nextPaymentStatus === "paid");

  const shouldReleaseStock =
    stockReserved &&
    !stockCommitted &&
    !stockReleased &&
    nextOrderStatus === "cancelled";

  if (shouldCommitStock) {
    for (const item of orderItems ?? []) {
      const { data: stockResult, error: stockError } = await supabaseAdmin.rpc(
        "commit_reserved_stock",
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
              "Rezerve stok gerçek stoğa işlenemedi.",
          },
          { status: 500 },
        );
      }
    }

    stockCommitted = true;
  }

  if (shouldReleaseStock) {
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
              "Rezerve stok serbest bırakılamadı.",
          },
          { status: 500 },
        );
      }
    }

    stockReleased = true;
  }

  const now = new Date().toISOString();

  const updatePayload = {
    order_status: nextOrderStatus,
    payment_status: nextPaymentStatus,
    customer_note: body.customer_note ?? null,

    cargo_company: body.cargo_company ?? null,
    cargo_tracking_code: body.cargo_tracking_code ?? null,
    cargo_tracking_url: body.cargo_tracking_url ?? null,
    cargo_status: nextCargoStatus,

    cargo_created_at:
      nextCargoStatus === "shipped" && !currentOrder.cargo_created_at
        ? now
        : currentOrder.cargo_created_at,

    cargo_delivered_at:
      nextCargoStatus === "delivered" && !currentOrder.cargo_delivered_at
        ? now
        : currentOrder.cargo_delivered_at,

    stock_reserved: stockReserved,
    stock_committed: stockCommitted,
    stock_released: stockReleased,
  };

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const shouldSendCargoEmail =
    nextCargoStatus === "shipped" &&
    currentOrder.cargo_status !== "shipped" &&
    Boolean(currentOrder.customer_email);

  if (shouldSendCargoEmail) {
    try {
      await sendCargoNotificationEmail({
        customerName: currentOrder.customer_name,
        customerEmail: currentOrder.customer_email,
        orderCode: currentOrder.order_code ?? currentOrder.id.slice(0, 8),
        cargoCompany: body.cargo_company,
        trackingCode: body.cargo_tracking_code,
        trackingUrl: body.cargo_tracking_url,
      });
    } catch (emailError) {
      console.warn("Kargo bildirimi gönderilemedi:", emailError);
    }
  }

  return NextResponse.json({
    ok: true,
    stockReserved,
    stockCommitted,
    stockReleased,
  });
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
  }

  const { id } = await params;

  const { data: currentOrder, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, stock_reserved, stock_committed, stock_released")
    .eq("id", id)
    .single();

  if (orderError || !currentOrder) {
    return NextResponse.json(
      { error: orderError?.message ?? "Sipariş bulunamadı." },
      { status: 404 },
    );
  }

  if (!currentOrder.stock_reserved) {
    return NextResponse.json(
      { error: "Bu sipariş için aktif rezerv kaydı yok." },
      { status: 400 },
    );
  }

  if (currentOrder.stock_committed) {
    return NextResponse.json(
      { error: "Bu siparişin stoku kesinleşmiş. Rezerv serbest bırakılamaz." },
      { status: 400 },
    );
  }

  if (currentOrder.stock_released) {
    return NextResponse.json(
      { error: "Bu siparişin rezervi zaten serbest bırakılmış." },
      { status: 400 },
    );
  }

  const { data: orderItems, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("product_id, product_name, quantity")
    .eq("order_id", id);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  if (!orderItems || orderItems.length === 0) {
    return NextResponse.json(
      { error: "Bu siparişe ait ürün kalemi bulunamadı." },
      { status: 400 },
    );
  }

  for (const item of orderItems) {
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
            `${item.product_name ?? item.product_id} için rezerv serbest bırakılamadı.`,
        },
        { status: 500 },
      );
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      stock_released: true,
      order_status: "cancelled",
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}