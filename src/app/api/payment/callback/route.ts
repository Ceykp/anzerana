import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getIyzico } from "@/lib/iyzico";
import { sendOrderNotificationEmail } from "@/lib/order-email";

export const runtime = "nodejs";

type PaymentSessionItem = {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  unitPrice: number;
  unitPriceText: string;
  quantity: number;
  image?: string;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function retrieveCheckoutForm(token: string) {
  const iyzico = await getIyzico();

  return new Promise<any>((resolve, reject) => {
    iyzico.checkoutForm.retrieve(
      {
        locale: "tr",
        token,
      },
      (err: unknown, result: unknown) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      },
    );
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");

  if (!token) {
    return NextResponse.redirect(`${getSiteUrl()}/odeme?status=failed`);
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("payment_sessions")
    .select("*")
    .eq("iyzico_token", token)
    .single();

  if (sessionError || !session) {
    return NextResponse.redirect(
      `${getSiteUrl()}/odeme?status=session-not-found`,
    );
  }

  if (session.status === "paid" && session.order_id) {
    return NextResponse.redirect(
      `${getSiteUrl()}/odeme?status=success&orderId=${session.order_id}`,
    );
  }

  try {
    const paymentResult = await retrieveCheckoutForm(token);

    if (
      paymentResult?.status !== "success" ||
      paymentResult?.paymentStatus !== "SUCCESS"
    ) {
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          iyzico_callback_response: paymentResult,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return NextResponse.redirect(`${getSiteUrl()}/odeme?status=failed`);
    }

    const items = (session.cart_items ?? []) as PaymentSessionItem[];

    if (!Array.isArray(items) || items.length === 0) {
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          iyzico_callback_response: paymentResult,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return NextResponse.redirect(`${getSiteUrl()}/odeme?status=empty-cart`);
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: session.customer_name,
        customer_email: session.customer_email,
        customer_phone: session.customer_phone,
        shipping_city: session.shipping_city,
        shipping_district: session.shipping_district,
        shipping_address: session.shipping_address,
        subtotal: Number(session.subtotal || 0),
        shipping_fee: Number(session.shipping_fee || 0),
        total: Number(session.total || 0),
        payment_method: "iyzico",
        payment_status: "paid",
        order_status: "confirmed",
        customer_note: session.customer_note || null,
        stock_reserved: false,
        stock_committed: true,
        stock_released: false,
      })
      .select("id, order_code")
      .single();

    if (orderError || !order) {
      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          iyzico_callback_response: {
            paymentResult,
            orderError: orderError?.message ?? "Sipariş oluşturulamadı.",
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return NextResponse.redirect(`${getSiteUrl()}/odeme?status=order-error`);
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_slug: item.productSlug,
      product_name: item.productName,
      variant_id: item.variantId,
      variant_label: item.variantLabel,
      unit_price: Number(item.unitPrice || 0),
      unit_price_text: item.unitPriceText,
      quantity: Number(item.quantity || 1),
      line_total: Number(item.unitPrice || 0) * Number(item.quantity || 1),
      image: item.image || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      await supabaseAdmin
        .from("payment_sessions")
        .update({
          status: "failed",
          iyzico_callback_response: {
            paymentResult,
            itemsError: itemsError.message,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id);

      return NextResponse.redirect(`${getSiteUrl()}/odeme?status=items-error`);
    }

    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("track_stock")
        .eq("id", item.productId)
        .single();

      if (!product?.track_stock) continue;

      const { data: stockResult, error: stockError } = await supabaseAdmin.rpc(
        "decrement_product_stock",
        {
          product_id_input: item.productId,
          quantity_input: Number(item.quantity || 1),
        },
      );

      if (stockError || stockResult?.ok === false) {
        await supabaseAdmin.from("orders").delete().eq("id", order.id);

        await supabaseAdmin
          .from("payment_sessions")
          .update({
            status: "failed",
            iyzico_callback_response: {
              paymentResult,
              stockError: stockResult?.error ?? stockError?.message,
            },
            updated_at: new Date().toISOString(),
          })
          .eq("id", session.id);

        return NextResponse.redirect(`${getSiteUrl()}/odeme?status=stock-error`);
      }
    }

    await supabaseAdmin
      .from("payment_sessions")
      .update({
        status: "paid",
        order_id: order.id,
        iyzico_callback_response: paymentResult,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    try {
      await sendOrderNotificationEmail({
        orderId: order.id,
        orderCode: order.order_code,
        customerName: session.customer_name,
        customerEmail: session.customer_email,
        customerPhone: session.customer_phone,
        shippingCity: session.shipping_city,
        shippingDistrict: session.shipping_district,
        shippingAddress: session.shipping_address,
        customerNote: session.customer_note || null,
        subtotal: Number(session.subtotal || 0),
        shippingFee: Number(session.shipping_fee || 0),
        total: Number(session.total || 0),
        items: items.map((item) => ({
          productName: item.productName,
          variantLabel: item.variantLabel,
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.unitPrice || 0),
        })),
      });
    } catch (emailError) {
      console.warn("Ödeme sonrası sipariş maili gönderilemedi:", emailError);
    }

    return NextResponse.redirect(
      `${getSiteUrl()}/odeme?status=success&orderId=${order.id}&orderCode=${
        order.order_code ?? ""
      }`,
    );
  } catch (error) {
    console.error("iyzico callback hatası:", error);

    await supabaseAdmin
      .from("payment_sessions")
      .update({
        status: "failed",
        iyzico_callback_response: {
          error: String(error),
        },
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    return NextResponse.redirect(`${getSiteUrl()}/odeme?status=failed`);
  }
}