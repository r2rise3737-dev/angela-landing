import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount = 0, title = "Demo" } = body || {};
    // демо-ответ, чтобы PaymentDialog мог (если вдруг будет звать) получить ok
    return NextResponse.json({ ok: true, client_secret: null, amount, title });
  } catch (e) {
    console.error("[create-intent] error", e);
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "demo endpoint" });
}
