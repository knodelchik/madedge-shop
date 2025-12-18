'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      
      return order.id; // Повертаємо orderId для PayPal Buttons
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
          orderID: data.orderID, // Це ID, який згенерував PayPal
        }),
      });

      const details = await res.json();
      if (!res.ok) throw new Error(details.error || "Capture failed");

      // Успіх! Перенаправляємо на сторінку результату
      // Отримуємо внутрішній ID з відповіді (reference_id) або використовуємо той, що у нас є, якщо потрібно
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
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "black" }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={(err) => {
            console.error("PayPal Error:", err);
            toast.error("PayPal Error occurred");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}