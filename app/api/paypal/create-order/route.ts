// app/api/paypal/create-order/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAccessToken, PAYPAL_API_BASE } from '../../../lib/paypal';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ігноруємо amountUSD, який прийшов з фронтенду
    const { items, shippingAddress, shippingType } = body;

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json({ error: 'Відсутні обов\'язкові дані' }, { status: 400 });
    }

    // --- 🛡️ SECURITY CALCULATION ---
    
    // 1. Отримуємо товари з БД
    const itemIds = items.map((i: any) => i.id);
    const { data: dbProducts, error: prodError } = await supabaseAdmin
      .from('products')
      .select('id, price, title, images, stock')
      .in('id', itemIds);

    if (prodError || !dbProducts) throw new Error("Помилка перевірки товарів");

    let calculatedTotalUSD = 0;
    const orderItemsData = [];

    for (const clientItem of items) {
      const dbProduct = dbProducts.find((p) => p.id === clientItem.id);
      
      if (!dbProduct) throw new Error(`Товар ${clientItem.title} не знайдено`);
      
      const itemTotal = Number(dbProduct.price) * Number(clientItem.quantity);
      calculatedTotalUSD += itemTotal;

      orderItemsData.push({
        product_id: dbProduct.id,
        product_title: dbProduct.title,
        quantity: clientItem.quantity,
        price: dbProduct.price,
        image_url: dbProduct.images?.[0] || ''
      });
    }

    // 2. Рахуємо доставку
    const { data: deliverySettings } = await supabaseAdmin.from('delivery_settings').select('*');
    let shippingCost = 0;
    
    if (deliverySettings) {
      const countryCode = shippingAddress.country_code;
      const setting = deliverySettings.find(s => s.country_code === countryCode) || deliverySettings.find(s => s.country_code === 'ROW');
      if (setting) {
        shippingCost = shippingType === 'Express' ? Number(setting.express_price) : Number(setting.standard_price);
      }
    }

    const finalAmountUSD = calculatedTotalUSD + shippingCost;
    // --- END SECURITY CALCULATION ---


    // 3. Створюємо замовлення в БД
    const uniqueOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = shippingAddress.user_id;

    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      id: uniqueOrderId,
      user_id: userId,
      total_amount: finalAmountUSD,
      status: 'pending',
      payment_method: 'paypal',
      shipping_address: shippingAddress,
      shipping_cost: shippingCost,
      shipping_type: shippingType
    });

    if (dbError) throw new Error(`Supabase Error: ${dbError.message}`);

    // 4. Зберігаємо items
    const itemsToInsert = orderItemsData.map(item => ({ ...item, order_id: uniqueOrderId }));
    await supabaseAdmin.from('order_items').insert(itemsToInsert);

    // 5. Запит до PayPal
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
    
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: uniqueOrderId,
          amount: {
            currency_code: "USD",
            value: finalAmountUSD.toFixed(2), // Лише порахована сервером сума
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
      console.error("PayPal Error Response:", orderData);
      throw new Error(JSON.stringify(orderData));
    }

    return NextResponse.json({ id: orderData.id });

  } catch (error: any) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating order' }, { status: 500 });
  }
}