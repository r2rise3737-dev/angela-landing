// src/lib/sign.ts
import { createHmac, timingSafeEqual } from "crypto";

export type SignedPayload = {
  courseId: string;
  stars: number;
  exp: number; // ms since epoch
};

// Компактный токен: base64url(payload).signature
export function signCompact(payload: SignedPayload, secret: string): string {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json, "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(json).digest("base64url");
  return `${body}.${sig}`;
}

// Проверка токена и возврат payload либо null
export function verifyCompact(token: string, secret: string): SignedPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [bodyB64, sig] = parts;
  try {
    const json = Buffer.from(bodyB64, "base64url").toString("utf8");
    const expected = createHmac("sha256", secret).update(json).digest("base64url");

    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;

    const parsed = JSON.parse(json) as Partial<SignedPayload>;
    if (
      !parsed ||
      typeof parsed.courseId !== "string" ||
      typeof parsed.stars !== "number" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }
    return { courseId: parsed.courseId, stars: parsed.stars, exp: parsed.exp };
  } catch {
    return null;
  }
}

// Удобный «отпечаток» секрета для логов
export function secretFingerprint(secret: string): string {
  return createHmac("sha256", "fp").update(secret).digest("hex").slice(0, 8);
}
