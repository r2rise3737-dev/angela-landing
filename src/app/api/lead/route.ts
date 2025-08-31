import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // токен LandBot
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // канал/чат для лидов
const TG_THREAD = process.env.LEAD_THREAD_ID;    // опционально: id треда форума

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function sendToTelegram(text: string) {
  if (!TG_TOKEN || !TG_CHAT_ID) {
    throw new Error("ENV отсутствуют: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID");
  }

  const payload: Record<string, unknown> = {
    chat_id: TG_CHAT_ID,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (TG_THREAD && /^\d+$/.test(TG_THREAD)) {
    payload.message_thread_id = Number(TG_THREAD);
  }

  const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Telegram error: ${res.status} ${res.statusText} ${t}`);
  }
}

type LeadPayload = {
  // поддерживаем разные имена полей, которые могла отправлять форма
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string | number;
  tel?: string | number;
  telegram?: string;
  tg?: string;
  question?: string;
  message?: string;
  source?: string; // "contact" для нижней формы
  track?: string;
};

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json().catch(() => ({}))) as unknown;
    const data =
      raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

    // нормализуем
    const name = String((data.name ?? data.fullName) ?? "").trim();
    const email = String(data.email ?? "").trim();
    const phone = String((data.phone ?? data.tel) ?? "").trim();
    const telegram = String((data.telegram ?? data.tg) ?? "").trim();
    const question = String((data.question ?? data.message) ?? "").trim();
    const source = String(data.source ?? "lead").trim();
    const track = String(data.track ?? "").trim();

    const hasAnyContact = Boolean(name || email || phone || telegram);

    // твоя исходная логика валидации сохранена
    if (source === "contact") {
      if (!hasAnyContact || !question) {
        return NextResponse.json(
          { ok: false, error: "Укажите контакт и вопрос" },
          { status: 400 }
        );
      }
    } else {
      if (!hasAnyContact) {
        return NextResponse.json(
          { ok: false, error: "Укажите контакт" },
          { status: 400 }
        );
      }
    }

    const lines = [
      `<b>Новая заявка (${esc(source)})</b>`,
      track ? `Направление: <b>${esc(track)}</b>` : null,
      name ? `Имя: <b>${esc(name)}</b>` : null,
      email ? `Email: <code>${esc(email)}</code>` : null,
      phone ? `Телефон: <code>${esc(phone)}</code>` : null,
      telegram ? `Telegram: <code>${esc(telegram)}</code>` : null,
      `Вопрос: ${question ? esc(question) : "<i>(без вопроса)</i>"}`,
      `⏰ ${new Date().toLocaleString("ru-RU")}`,
    ].filter(Boolean);

    await sendToTelegram(lines.join("\n"));
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/lead] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

// чтобы не кэшировалось
export const dynamic = "force-dynamic";
