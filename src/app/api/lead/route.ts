import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email = "", phone = "", question = "" } = body || {};
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Email обязателен" }, { status: 400 });
    }

    // Если TELEGRAM_* не заданы — просто логируем и отдаём OK
    const BOT = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT = process.env.TELEGRAM_CHAT_ID;
    if (BOT && CHAT) {
      try {
        const text = `Новая заявка:
Email: ${email}
Телефон: ${phone || "-"}
Вопрос: ${question || "-"}`;
        const res = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: CHAT, text }),
        });
        const data = await res.json();
        if (!data.ok) console.error("[LEAD] Telegram send error:", data);
      } catch (e) {
        console.error("[LEAD] Telegram request failed:", e);
      }
    } else {
      console.log("[LEAD] без Telegram:", { email, phone, question });
    }

    return NextResponse.json({ ok: true }); // успех
  } catch (e) {
    console.error("/api/lead error:", e);
    return NextResponse.json({ ok: false }, { status: 200 }); // мягкий ответ чтобы фронт не падал
  }
}
