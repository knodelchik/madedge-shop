import crypto from 'crypto';

interface FondyParams {
  [key: string]: string | number | undefined;
}

export const generateFondySignature = (params: FondyParams, secretKey: string): string => {
  // 1. Отримуємо всі ключі і сортуємо їх за алфавітом (вимога Fondy)
  const sortedKeys = Object.keys(params).sort();

  // 2. Формуємо рядок для підпису:
  // Беремо тільки значення, ігноруємо пусті та сам підпис
  const signatureString = sortedKeys
    .filter((key) => key !== 'signature' && params[key] !== '' && params[key] !== undefined)
    .map((key) => params[key])
    .join('|');

  // 3. Додаємо секретний ключ у кінець рядка
  const stringToSign = `${secretKey}|${signatureString}`;

  // 4. Хешуємо.
  // ВАЖЛИВО: Fondy вимагає саме SHA-1 для своїх стандартних інтеграцій.
  // Зміна на sha256/sha512 призведе до помилки "Signature mismatch" на стороні Fondy.
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
};