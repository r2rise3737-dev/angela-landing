// bot/index.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Telegraf, Markup } from 'telegraf';
import type { Context } from 'telegraf';

// ========== ENV ==========
const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is missing');

const LANDING_URL = process.env.LANDING_URL || 'https://angela-landing-clean.vercel.app';
const BUTTONS_PER_ROW = Math.max(1, Number(process.env.BUTTONS_PER_ROW || 1));
const BUTTON_LABEL_LIMIT = Math.max(10, Number(process.env.BUTTON_LABEL_LIMIT || 28));

// ========== BOT ==========
const bot = new Telegraf(BOT_TOKEN);

// ========== DATA SOURCES (работаем из папки bot/) ==========
const coursesPath = path.join(process.cwd(), 'data', 'courses.json');
const invoicesPath = path.join(process.cwd(), 'invoice-links.json');

type Course = {
  id: string;
  title: string;
  desc?: string;
  rub?: number;
  short?: string;
  label?: string;
};

function readJSON<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
}
function loadCourses(): Course[] { return readJSON<Course[]>(coursesPath); }
function loadInvoices(): Record<string, string> { return readJSON<Record<string,string>>(invoicesPath); }

// ФИКСИРОВАННЫЙ порядок — чтобы ВСЕГДА было 5/5
const TAROT_IDS = [
  'tarot-basic',
  'pro-interpretation',
  'love-money-spreads',
  'tarot-for-brands',
  'master-diagnostics',
] as const;

const ASTRO_IDS = [
  'astro-basic',
  'astro-profi',
  'astro-synastry',
  'astro-prognostics',
  'astro-blog-business',
] as const;

// ========== UTILS ==========
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function clipLabel(s: string) {
  const t = (s || '').trim();
  return t.length > BUTTON_LABEL_LIMIT ? t.slice(0, BUTTON_LABEL_LIMIT - 1) + '…' : t;
}
function labelOf(c?: Course) {
  if (!c) return '—';
  return clipLabel(c.label || c.short || c.title);
}

// ========== KEYBOARDS ==========
// Корень: всегда 3 кнопки
function rootKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🔮 Таро', 'menu:tarot'),
      Markup.button.callback('🌌 Астрология', 'menu:astro'),
    ],
    [Markup.button.url('✨ Посмотреть программы', LANDING_URL)],
  ]);
}

// Подменю из 5 инвойсов + назад + дублирование «Программы»
function sectionKeyboard(section: 'tarot'|'astro') {
  const COURSES = loadCourses();
  const INVOICES = loadInvoices();

  const order = section === 'tarot' ? TAROT_IDS : ASTRO_IDS;
  const byId: Record<string, Course> = Object.fromEntries(COURSES.map(c => [c.id, c]));

  const btns = order.map(id => {
    const c = byId[id];
    const url = INVOICES[id];
    const text = labelOf(c);
    return url ? Markup.button.url(text, url) : Markup.button.callback(`⛔ ${text}`, 'noop');
  });

  const rows = chunk(btns, BUTTONS_PER_ROW);
  rows.push([Markup.button.callback('⬅️ Назад', 'menu:root')]);
  rows.push([Markup.button.url('✨ Программы', LANDING_URL)]);

  return Markup.inlineKeyboard(rows);
}

// Безопасное обновление клавиатуры у ЭТОГО сообщения
async function editHere(ctx: any, kb: ReturnType<typeof rootKeyboard>) {
  try {
    await ctx.editMessageReplyMarkup(kb.reply_markup);
  } catch (e: any) {
    const d = String(e?.description || e?.message || '');
    if (!d.includes('message is not modified')) {
      console.error('[editHere] error:', d);
    }
  }
}

// ========== MENU HANDLERS ==========
bot.action('menu:root', async (ctx) => {
  await ctx.answerCbQuery().catch(()=>{});
  await editHere(ctx, rootKeyboard());
});
bot.action('menu:tarot', async (ctx) => {
  await ctx.answerCbQuery('Таро').catch(()=>{});
  await editHere(ctx, sectionKeyboard('tarot'));
});
bot.action('menu:astro', async (ctx) => {
  await ctx.answerCbQuery('Астрология').catch(()=>{});
  await editHere(ctx, sectionKeyboard('astro'));
});
bot.action('noop', async (ctx) => {
  await ctx.answerCbQuery('Инвойс временно недоступен. Сгенерируй заново.', { show_alert: true }).catch(()=>{});
});

// Вспомогательная команда: подхватить обновлённые JSON без перезапуска
bot.command('reload', async (ctx) => {
  // просто прочитаем файлы и скажем ОК; сами клавиатуры и так читают «на лету»
  try {
    loadCourses(); loadInvoices();
    await ctx.reply('Файлы подхвачены ✔️', rootKeyboard());
  } catch (e) {
    await ctx.reply('Ошибка чтения файлов.');
  }
});

// ========== МАСТЕР ПУБЛИКАЦИИ ЧЕРЕЗ /start ==========
type Draft = {
  step: 'channel'|'text'|'media'|'preview';
  channel?: string; // @username или -100...
  textMsg?: { chat_id: number; message_id: number; text?: string; entities?: any[] };
  mediaMsg?: { chat_id: number; message_id: number };
};
const STATE = new Map<number, Draft>();

function normalizeChatId(v: string) {
  const t = v.trim();
  if (/^-?\d+$/.test(t)) return t;
  return t.startsWith('@') ? t : `@${t}`;
}

bot.start(async (ctx) => {
  STATE.set(ctx.from.id, { step: 'channel' });
  await ctx.reply('Ок, сделаем пост с меню.\n\n1) В какой канал публикуем? Пришли @username или -100…');
});
bot.command('cancel', async (ctx) => {
  STATE.delete(ctx.from.id);
  await ctx.reply('Сбросил. Набери /start заново.');
});

// шаг 1 — канал
bot.hears(/^(@[A-Za-z0-9_]{4,}|-100[0-9]+)/, async (ctx, next) => {
  const d = STATE.get(ctx.from.id);
  if (!d || d.step !== 'channel') return next();
  d.channel = normalizeChatId((ctx.message as any).text);
  d.step = 'text';
  await ctx.reply(`Канал: <b>${d.channel}</b>\n\n2) Пришли <b>текст</b> одним сообщением (жирный/курсив/ссылки сохранятся).`, { parse_mode: 'HTML' });
});

// шаг 2 — текст
bot.on('text', async (ctx, next) => {
  const d = STATE.get(ctx.from.id);
  if (!d || d.step !== 'text') return next();

  d.textMsg = {
    chat_id: ctx.chat!.id,
    message_id: ctx.message!.message_id,
    text: (ctx.message as any).text,
    entities: (ctx.message as any).entities || [],
  };
  d.step = 'media';
  await ctx.reply('3) Пришли <b>медиа</b> (фото/видео/гиф/голос) отдельным сообщением — или напиши «нет».', { parse_mode: 'HTML' });
});

// шаг 3 — медиа / нет
bot.hears(/^нет$/i, async (ctx) => {
  const d = STATE.get(ctx.from.id);
  if (!d || d.step !== 'media' || !d.channel) return;
  d.step = 'preview';
  await showPreview(ctx, d);
});
bot.on(['photo','video','animation','voice','document'], async (ctx, next) => {
  const d = STATE.get(ctx.from.id);
  if (!d || d.step !== 'media' || !d.channel) return next();

  d.mediaMsg = { chat_id: ctx.chat!.id, message_id: (ctx.message as any).message_id };
  d.step = 'preview';
  await showPreview(ctx, d);
});

async function showPreview(ctx: Context, d: Draft) {
  await ctx.reply(
    `Предпросмотр готов.\nКанал публикации: <b>${d.channel}</b>`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [ Markup.button.callback('✅ Опубликовать', 'post:publish') ],
        [ Markup.button.callback('♻️ Сбросить', 'post:reset') ],
      ])
    }
  );

  try {
    if (d.mediaMsg) {
      await ctx.telegram.copyMessage(
        ctx.chat!.id,
        d.mediaMsg.chat_id,
        d.mediaMsg.message_id,
        d.textMsg
          ? { caption: d.textMsg.text, caption_entities: d.textMsg.entities, reply_markup: rootKeyboard().reply_markup }
          : { reply_markup: rootKeyboard().reply_markup }
      );
    } else if (d.textMsg) {
      await ctx.telegram.copyMessage(
        ctx.chat!.id,
        d.textMsg.chat_id,
        d.textMsg.message_id,
        { reply_markup: rootKeyboard().reply_markup }
      );
    }
  } catch (e) {
    console.error('[preview.copyMessage] error:', e);
  }
}

bot.action('post:reset', async (ctx) => {
  STATE.delete(ctx.from.id);
  await ctx.editMessageText('Сбросил. Набери /start заново.');
});

bot.action('post:publish', async (ctx) => {
  const d = STATE.get(ctx.from.id);
  if (!d?.channel) {
    await ctx.answerCbQuery('Канал не выбран', { show_alert: true }).catch(()=>{});
    return;
  }
  await ctx.answerCbQuery().catch(()=>{});

  try {
    let res: any;
    if (d.mediaMsg) {
      res = await ctx.telegram.copyMessage(
        d.channel, d.mediaMsg.chat_id, d.mediaMsg.message_id,
        d.textMsg
          ? { caption: d.textMsg.text, caption_entities: d.textMsg.entities, reply_markup: rootKeyboard().reply_markup }
          : { reply_markup: rootKeyboard().reply_markup }
      );
    } else if (d.textMsg) {
      res = await ctx.telegram.copyMessage(
        d.channel, d.textMsg.chat_id, d.textMsg.message_id,
        { reply_markup: rootKeyboard().reply_markup }
      );
    } else {
      await ctx.reply('Нет контента. Пришли текст или медиа.');
      return;
    }

    // сохраним ссылку на опубликованный пост
    try {
      let url = '';
      const ch = d.channel;
      if (typeof ch === 'string' && ch.startsWith('@')) url = `https://t.me/${ch.slice(1)}/${res.message_id}`;
      else if (/^-?100\d+$/.test(String(ch))) url = `https://t.me/c/${String(ch).replace('-100','')}/${res.message_id}`;
      fs.writeFileSync(path.join(process.cwd(), 'menu-post.json'), JSON.stringify({ url, chat_id: d.channel, message_id: res.message_id }, null, 2), 'utf8');
    } catch {}

    await ctx.editMessageText(`Готово ✅ Пост опубликован в <b>${d.channel}</b>. Меню активно.`, { parse_mode: 'HTML' });
    STATE.delete(ctx.from.id);
  } catch (e: any) {
    await ctx.reply(`Ошибка публикации: ${e?.description || e?.message || e}`);
  }
});

// ========== RUN ==========
bot.launch().then(()=>console.log('[boot] bot started'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
