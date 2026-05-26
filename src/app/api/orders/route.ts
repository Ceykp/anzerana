import { sendOrderNotificationEmail } from "@/lib/order-email";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

type OrderItemInput = {
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

type ProductStockRow = {
  id: string;
  name: string;
  stock_quantity: number;
  reserved_quantity: number;
  track_stock: boolean;
  allow_backorder: boolean;
};

export async function POST(request: Request) {
  const reservedItems: OrderItemInput[] = [];

  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingCity,
      shippingDistrict,
      shippingAddress,
      customerNote,
      items,
      subtotal,
      shippingFee,
      total,
    } = body;

    if (
      !customerName ||
      !customerPhone ||
      !shippingCity ||
      !shippingDistrict ||
      !shippingAddress
    ) {
      return NextResponse.json(
        { error: "Zorunlu müşteri ve adres bilgileri eksik." },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Sepet boş. Sipariş oluşturulamadı." },
        { status: 400 },
      );
    }

    const normalizedItems: OrderItemInput[] = items.map((item) => ({
      productId: String(item.productId ?? ""),
      productSlug: String(item.productSlug ?? ""),
      productName: String(item.productName ?? ""),
      variantId: String(item.variantId ?? ""),
      variantLabel: String(item.variantLabel ?? ""),
      unitPrice: Number(item.unitPrice || 0),
      unitPriceText: String(item.unitPriceText ?? ""),
      quantity: Number(item.quantity || 0),
      image: item.image ? String(item.image) : undefined,
    }));

    const invalidItem = normalizedItems.find(
      (item) =>
        !item.productId ||
        !item.productSlug ||
        !item.productName ||
        !item.variantId ||
        !item.variantLabel ||
        item.unitPrice < 0 ||
        item.quantity < 1,
    );

    if (invalidItem) {
      return NextResponse.json(
        { error: "Sepette geçersiz ürün bilgisi var." },
        { status: 400 },
      );
    }

    const calculatedSubtotal = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const safeShippingFee = Number(shippingFee || 0);
    const safeTotal = calculatedSubtotal + safeShippingFee;

    if (Number(subtotal) !== calculatedSubtotal || Number(total) !== safeTotal) {
      return NextResponse.json(
        { error: "Sipariş tutarı doğrulanamadı." },
        { status: 400 },
      );
    }

    const productIds = [
      ...new Set(normalizedItems.map((item) => item.productId)),
    ];

    const { data: productRows, error: productError } = await supabaseAdmin
      .from("products")
      .select(
        "id, name, stock_quantity, reserved_quantity, track_stock, allow_backorder",
      )
      .in("id", productIds);

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 },
      );
    }

    const productMap = new Map<string, ProductStockRow>(
      (productRows ?? []).map((product) => [product.id, product]),
    );

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `${item.productName} ürünü bulunamadı.` },
          { status: 400 },
        );
      }

      const availableStock =
        Number(product.stock_quantity || 0) -
        Number(product.reserved_quantity || 0);

      if (
        product.track_stock &&
        !product.allow_backorder &&
        availableStock < item.quantity
      ) {
        return NextResponse.json(
          {
            error: `${product.name} için yeterli stok yok. Satılabilir stok: ${availableStock}`,
          },
          { status: 400 },
        );
      }
    }

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (!product?.track_stock) continue;

      const { data: stockResult, error: stockError } = await supabaseAdmin.rpc(
        "reserve_product_stock",
        {
          product_id_input: item.productId,
          quantity_input: item.quantity,
        },
      );

      if (stockError || stockResult?.ok === false) {
        for (const reservedItem of reservedItems) {
          await supabaseAdmin.rpc("release_reserved_stock", {
            product_id_input: reservedItem.productId,
            quantity_input: reservedItem.quantity,
          });
        }

        return NextResponse.json(
          {
            error:
              stockResult?.error ??
              stockError?.message ??
              "Stok rezerve edilemedi.",
          },
          { status: 400 },
        );
      }

      reservedItems.push(item);
    }

    const hasReservedStock = reservedItems.length > 0;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail || null,
        customer_phone: customerPhone,
        shipping_city: shippingCity,
        shipping_district: shippingDistrict,
        shipping_address: shippingAddress,
        subtotal: calculatedSubtotal,
        shipping_fee: safeShippingFee,
        total: safeTotal,
        payment_method: "manual",
        payment_status: "pending",
        order_status: "pending",
        customer_note: customerNote || null,
        stock_reserved: hasReservedStock,
        stock_committed: false,
        stock_released: false,
        reservation_expires_at: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toISOString(),
      })
      .select("id, order_code")
      .single();

    if (orderError || !order) {
      for (const reservedItem of reservedItems) {
        await supabaseAdmin.rpc("release_reserved_stock", {
          product_id_input: reservedItem.productId,
          quantity_input: reservedItem.quantity,
        });
      }

      return NextResponse.json(
        { error: orderError?.message ?? "Sipariş oluşturulamadı." },
        { status: 500 },
      );
    }

    const orderItems = normalizedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_slug: item.productSlug,
      product_name: item.productName,
      variant_id: item.variantId,
      variant_label: item.variantLabel,
      unit_price: item.unitPrice,
      unit_price_text: item.unitPriceText,
      quantity: item.quantity,
      line_total: item.unitPrice * item.quantity,
      image: item.image || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      for (const reservedItem of reservedItems) {
        await supabaseAdmin.rpc("release_reserved_stock", {
          product_id_input: reservedItem.productId,
          quantity_input: reservedItem.quantity,
        });
      }

      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    try {
      await sendOrderNotificationEmail({
        orderId: order.id,
        orderCode: order.order_code,
        customerName,
        customerEmail: customerEmail || null,
        customerPhone,
        shippingCity,
        shippingDistrict,
        shippingAddress,
        customerNote: customerNote || null,
        subtotal: calculatedSubtotal,
        shippingFee: safeShippingFee,
        total: safeTotal,
        items: normalizedItems.map((item) => ({
          productName: item.productName,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    } catch (emailError) {
      console.warn("Sipariş e-posta bildirimi gönderilemedi:", emailError);
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderCode: order.order_code,
    });
  } catch {
    for (const reservedItem of reservedItems) {
      await supabaseAdmin.rpc("release_reserved_stock", {
        product_id_input: reservedItem.productId,
        quantity_input: reservedItem.quantity,
      });
    }

    return NextResponse.json(
      { error: "Beklenmeyen bir sipariş hatası oluştu." },
      { status: 500 },
    );
  }
}