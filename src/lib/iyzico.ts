import Iyzipay from "iyzipay";

const apiKey = process.env.IYZICO_API_KEY;
const secretKey = process.env.IYZICO_SECRET_KEY;
const baseUrl = process.env.IYZICO_BASE_URL;

if (!apiKey || !secretKey || !baseUrl) {
  console.warn("iyzico env bilgileri eksik. Ödeme sistemi çalışmayabilir.");
}

export const iyzico = new Iyzipay({
  apiKey: apiKey ?? "",
  secretKey: secretKey ?? "",
  uri: baseUrl ?? "https://sandbox-api.iyzipay.com",
});

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function formatIyzicoPrice(value: number) {
  return Number(value || 0).toFixed(2);
}

export function createConversationId(prefix = "anz") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}