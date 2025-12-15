import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createMonoInvoice } from '../../lib/monobank'; // Імпорт нової функції
import paypalClient from '../../lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

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

    // 1. Створюємо замовлення в базі (статус pending)
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

    if (dbError) throw new Error(dbError.message);

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

    // === PAYPAL ЛОГІКА (залишаємо без змін) ===
    if (method === 'paypal') {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                reference_id: uniqueOrderId,
                amount: { currency_code: 'USD', value: amountUSD.toFixed(2) }
            }],
            application_context: {
                return_url: `${BASE_URL}/order/result?source=paypal&orderId=${uniqueOrderId}`,
                cancel_url: `${BASE_URL}/order?status=cancelled`
            }
        });
        const order = await paypalClient().execute(request);
        const approveLink = order.result.links.find((link: any) => link.rel === 'approve').href;
        return NextResponse.json({ payment_url: approveLink });
    }

    // === MONOBANK ЛОГІКА (Замість Fondy) ===
    else {
        // Monobank приймає суму в копійках (для UAH code 980)
        const amountInCents = Math.round(Number(amountUAH) * 100);
        
        // Формуємо опис замовлення (для чека)
        const productsNames = items.map((i: any) => `${i.title} x${i.quantity}`).join(', ').substring(0, 250);

        const invoiceData = await createMonoInvoice({
            order_id: uniqueOrderId,
            amount: amountInCents,
            ccy: 980, // UAH
            redirectUrl: `${BASE_URL}/order/result?source=monobank&orderId=${uniqueOrderId}`, // Користувач повернеться сюди
            webHookUrl: `${BASE_URL}/api/payment-webhook`, // Monobank "стукне" сюди про успіх
            productName: productsNames || 'Payment for order',
        });

        return NextResponse.json({ payment_url: invoiceData.pageUrl });
    }

  } catch (error: any) {
    console.error('Create Payment Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}