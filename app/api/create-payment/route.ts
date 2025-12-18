// app/api/create-payment/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank';
// Імпортуємо наші нові хелпери
import { generateAccessToken, PAYPAL_API_BASE } from '../../lib/paypal';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amountUSD, amountUAH, items, shippingAddress, shippingCost, shippingType, method } = body;

    if (!amountUSD || !items || !shippingAddress) {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }

    const userId = shippingAddress.user_id;
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 1. Створюємо замовлення в БД
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: amountUSD,
      status: 'pending',
      payment_method: method,
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(`Supabase DB Error: ${dbError.message}`);

    // 2. Зберігаємо товари
    const orderItemsData = items.map((item: any) => ({
      order_id: uniqueOrderId,
      product_id: item.id,
      product_title: item.title,
      quantity: item.quantity,
      price: item.price,
      image_url: item.images?.[0] || ''
    }));
    await supabaseAdmin.from('order_items').insert(orderItemsData);

    // === PAYPAL ЛОГІКА (NATIVE FETCH) ===
    if (method === 'paypal') {
      try {
        const accessToken = await generateAccessToken();
        
        const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
        
        const payload = {
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: uniqueOrderId, // Наш внутрішній ID
              amount: {
                currency_code: "USD",
                value: amountUSD.toFixed(2),
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                brand_name: "MadEdge Shop",
                user_action: "PAY_NOW",
                return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                cancel_url: `${BASE_URL}/order?status=cancelled`,
              },
            },
          },
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const orderData = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(orderData));
        }

        return NextResponse.json({ id: orderData.id, internalOrderId: uniqueOrderId });

      } catch (paypalError: any) {
        console.error('PayPal API Error:', paypalError);
        return NextResponse.json({ error: 'PayPal creation failed', details: paypalError.message }, { status: 500 });
      }
    }

    // === MONOBANK ===
    else {
      const amountInCents = Math.round(Number(amountUAH) * 100);
      const productsNames = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 250);
      
      const invoiceData = await createMonoInvoice({
        order_id: uniqueOrderId,
        amount: amountInCents,
        ccy: 980,
        redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`,
        webHookUrl: `${BASE_URL}/api/payment-webhook`,
        productName: productsNames || 'Payment for order',
      });

      return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Create Payment Global Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}