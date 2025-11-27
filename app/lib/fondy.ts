import crypto from 'crypto';

export function generateFondySignature(params: any, secretKey: string): string {
  // 1. Беремо всі ключі, крім signature та response_signature_string
  const keys = Object.keys(params)
    .filter(key => key !== 'signature' && key !== 'response_signature_string')
    .sort(); // 2. Сортуємо за алфавітом

  // 3. Збираємо значення, які не порожні
  const values = keys.map(key => params[key]).filter(val => val !== '' && val !== null && val !== undefined);

  // 4. Додаємо секретний ключ на початок
  const rawString = [secretKey, ...values].join('|');

  // 5. SHA1 хеш
  return crypto.createHash('sha1').update(rawString).digest('hex');
}