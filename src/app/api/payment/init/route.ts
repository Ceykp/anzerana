import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  iyzico,
  createConversationId,
  formatIyzicoPrice,
  getSiteUrl,
} from "@/lib/iyzico";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer,
      items,
      subtotal,
      shippingFee,
      total,
    } = body;

    if (!customer || !items?.length) {
      return NextResponse.json(
        { error: "Sepet boş." },
        { status: 400 },
      );
    }

    const conversationId = createConversationId();

    await supabaseAdmin
      .from("payment_sessions")
      .insert({
        conversation_id: conversationId,

        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,

        shipping_city: customer.city,
        shipping_district: customer.district,
        shipping_address: customer.address,
        customer_note: customer.note ?? null,

        subtotal,
        shipping_fee: shippingFee,
        total,

        cart_items: items,
        status: "waiting_payment",
      });

    const callbackUrl =
      `${getSiteUrl()}/api/payment/callback`;

    const paymentRequest = {
      locale: "tr",

      conversationId,

      price: formatIyzicoPrice(total),
      paidPrice: formatIyzicoPrice(total),

      currency: "TRY",

      basketId: conversationId,

      paymentGroup: "PRODUCT",

      callbackUrl,

      buyer: {
        id: customer.email,

        name: customer.name,

        surname: "-",

        gsmNumber: customer.phone,

        email: customer.email,

        identityNumber: "11111111111",

        registrationAddress:
          customer.address,

        city: customer.city,

        country: "Turkey",

        zipCode: "41000",
      },

      shippingAddress: {
        contactName: customer.name,

        city: customer.city,

        country: "Turkey",

        address: customer.address,
      },

      billingAddress: {
        contactName: customer.name,

        city: customer.city,

        country: "Turkey",

        address: customer.address,
      },

      basketItems: items.map(
        (
          item: {
            productId: string;
            productName: string;
            unitPrice: number;
            quantity: number;
          },
          index: number,
        ) => ({
          id:
            item.productId ||
            `item-${index}`,

          name: item.productName,

          category1: "Yöresel Ürün",

          itemType: "PHYSICAL",

          price: formatIyzicoPrice(
            item.unitPrice *
              item.quantity,
          ),
        }),
      ),
    };

    const result = await new Promise<any>(
      (resolve, reject) => {
        iyzico.checkoutFormInitialize.create(
          paymentRequest,
          (
            err: unknown,
            res: unknown,
          ) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(res);
          },
        );
      },
    );

    if (
      result?.status !== "success"
    ) {
      return NextResponse.json(
        {
          error:
            result?.errorMessage ??
            "Ödeme başlatılamadı.",
        },
        {
          status: 400,
        },
      );
    }

    await supabaseAdmin
      .from("payment_sessions")
      .update({
        iyzico_token:
          result.token,

        iyzico_raw_response:
          result,
      })
      .eq(
        "conversation_id",
        conversationId,
      );

    return NextResponse.json({
      ok: true,

      token: result.token,

      checkoutFormContent:
        result.checkoutFormContent,
    });
  } catch (error) {
    console.error(
      "Ödeme başlatma hatası:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ödeme başlatılamadı.",
      },
      {
        status: 500,
      },
    );
  }
}