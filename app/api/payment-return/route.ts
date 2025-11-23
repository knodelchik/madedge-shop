// app/api/payment-return/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Fondy надсилає дані про оплату в body, ми можемо їх отримати, 
  // але для перенаправлення вони нам не критичні (статус перевіриться через webhook)
  const formData = await req.formData();
  
  // Отримуємо базовий URL
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Перенаправляємо користувача на сторінку профілю з параметром успіху
  // Статус 303 (See Other) змушує браузер змінити метод з POST на GET
// ...
// Змінюємо кінцеву точку редіректу
return NextResponse.redirect(`${baseUrl}/order/result?status=success`, 303);
}

// На випадок, якщо Fondy вирішить повернути через GET (деякі налаштування)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
// ...
// Змінюємо кінцеву точку редіректу
return NextResponse.redirect(`${baseUrl}/order/result?status=success`, 303);
}