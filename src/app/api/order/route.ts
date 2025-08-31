// src/app/api/order/route.ts
import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";
import { signCompact } from "@/lib/sign";

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400, headers: { "cache-control": "no-store" } });
    }

    const secret = process.env.ORDER_SECRET;
    const botUsernameEnv = process.env.BOT_USERNAME || "";
    const botUsername = botUsernameEnv.replace(/^@/, "");

    if (!secret || !botUsername) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500, headers: { "cache-control": "no-store" } });
    }

    const course = getCourse(courseId);
    if (!course) {
      return NextResponse.json({ error: "Unknown course" }, { status: 400, headers: { "cache-control": "no-store" } });
    }

    // токен на 10 минут
    const exp = Date.now() + 10 * 60 * 1000;
    const token = signCompact({ courseId: course.id, stars: course.stars, exp }, secret);

    const tgDeep = `tg://resolve?domain=${botUsername}&start=${encodeURIComponent(token)}`;
    const tgUrl  = `https://t.me/${botUsername}?start=${encodeURIComponent(token)}`;

    return NextResponse.json({ ok: true as const, tgUrl, tgDeep, token }, { status: 200, headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400, headers: { "cache-control": "no-store" } });
  }
}
