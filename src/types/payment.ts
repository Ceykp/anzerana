export type PaymentCartItem = {
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
  
  export type PaymentCustomer = {
    name: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    note?: string;
  };
  
  export type PaymentInitRequestBody = {
    customer: PaymentCustomer;
    items: PaymentCartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
  };
  
  export type PaymentSessionStatus =
    | "created"
    | "waiting_payment"
    | "paid"
    | "failed"
    | "cancelled";
  
  export type IyzicoInitResponse = {
    status?: string;
    errorMessage?: string;
    checkoutFormContent?: string;
    paymentPageUrl?: string;
    token?: string;
    conversationId?: string;
  };