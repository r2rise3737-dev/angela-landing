import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is missing in .env');

// Рублёвая стоимость 1 ⭐ и «чуть ниже» от цены
const RUB_PER_STAR = Number(process.env.RUB_PER_STAR || 1.30);
const MAX_DISCOUNT_RUB = Number(process.env.MAX_DISCOUNT_RUB || 500);

const api = (method, payload) =>
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

function toStars(rub) {
  // целимся в (рублёвая цена - MAX_DISCOUNT_RUB), но не ниже 90% цены
  const targetRub = Math.max(Math.round(rub - MAX_DISCOUNT_RUB), Math.round(rub * 0.9));
  const stars = Math.max(1, Math.round(targetRub / RUB_PER_STAR)); // целые ⭐
  const approxRub = Math.round(stars * RUB_PER_STAR);
  return { stars, approxRub };
}

const coursesPath = path.join(process.cwd(), 'data', 'courses.json');
const outPath = path.join(process.cwd(), 'invoice-links.json');

const raw = await fs.readFile(coursesPath, 'utf-8');
const courses = JSON.parse(raw);

const result = {};
for (const c of courses) {
  const { id, title, desc, rub } = c;
  const { stars, approxRub } = toStars(Number(rub));

  const payload = {
    title: String(title || id).slice(0, 32), // лимит TG
    description: String(desc || 'Оплата курса'),
    payload: `course:${id}`,
    currency: 'XTR',                 // Telegram Stars
    prices: [{ label: 'Stars', amount: stars }],
    provider_token: '',              // не нужен для XTR
    need_name: false,
    need_email: false,
    need_phone_number: false,
  };

  const res = await api('createInvoiceLink', payload);
  if (!res.ok) {
    console.error(`createInvoiceLink error for ${id}`, res);
    throw new Error(`createInvoiceLink failed for ${id}`);
  }
  result[id] = res.result;
  console.log(`[${id}] ${title} | ₽=${rub} → ⭐=${stars} (~≈ ${approxRub} ₽)`);
}

await fs.writeFile(outPath, JSON.stringify(result, null, 2), 'utf-8');
console.log('Saved:', outPath);
