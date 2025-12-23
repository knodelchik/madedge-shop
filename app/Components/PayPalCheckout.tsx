'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Додамо іконку завантаження

interface PayPalCheckoutProps {
  amountUSD: number;
  cartItems: any[];
  shippingAddress: any;
  shippingCost: number;
  shippingType: string;
}

export default function PayPalCheckout({ 
  amountUSD, 
  cartItems, 
  shippingAddress, 
  shippingCost, 
  shippingType 
}: PayPalCheckoutProps) {
  const router = useRouter();

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
  };

  const handleCreateOrder = async () => {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUSD,
          items: cartItems,
          shippingAddress,
          shippingCost,
          shippingType,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Order creation failed");
      
      return order.id;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const handleApprove = async (data: any) => {
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const details = await res.json();
      if (!res.ok) throw new Error(details.error || "Capture failed");

      const internalOrderId = details.data.purchase_units[0].reference_id;
      
      router.push(`/order/result?source=paypal&orderId=${internalOrderId}`);
      
    } catch (err: any) {
      console.error("PayPal Capture Error", err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="w-full z-0 relative">
      <PayPalScriptProvider options={initialOptions}>
        {/* ОБГОРТКА ДЛЯ АДАПТИВУ:
            1. transition-all: плавна зміна стилів
            2. dark:bg-neutral-100: у темній темі робимо фон світлим (майже білим)
            3. dark:p-4 dark:rounded-xl: додаємо відступи та скруглення, щоб це виглядало як картка
            Таким чином чорні кнопки PayPal будуть чітко видні на світлому фоні навіть у темній темі.
        */}
        <div className="w-full transition-all duration-300 rounded-xl overflow-hidden
          bg-transparent 
          dark:bg-neutral-100 dark:p-5 dark:shadow-md"
        >
          {/* Заголовок тільки для темної теми, щоб пояснити зміну фону (опціонально) */}
          <div className="hidden dark:block mb-3 text-sm font-medium text-neutral-500 text-center">
            PayPal Secure Checkout
          </div>

          <PayPalButtons
            style={{ 
              layout: "vertical", 
              shape: "rect", 
              color: "black",
              label: "pay" // Або 'checkout', 'buynow'
            }}
            className="relative z-10"
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onError={(err) => {
              console.error("PayPal Error:", err);
              toast.error("PayPal Error occurred");
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}