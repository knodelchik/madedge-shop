// app/lib/paypal.ts

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT } = process.env;

// Визначаємо базовий URL: Sandbox або Production
// Якщо змінна PAYPAL_ENVIRONMENT дорівнює 'production', використовуємо лайв, інакше - пісочницю
export const PAYPAL_API_BASE = process.env.PAYPAL_ENVIRONMENT === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

/**
 * Генерує Access Token для запитів до API
 */
export async function generateAccessToken() {
  // Шукаємо ключі. Підтримуємо і NEXT_PUBLIC версію для ID, якщо звичайної немає
  const clientId = PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("MISSING_API_CREDENTIALS: Перевірте PAYPAL_CLIENT_ID та PAYPAL_CLIENT_SECRET");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}