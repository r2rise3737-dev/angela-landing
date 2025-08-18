"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  Star,
  Users,
  Crown,
  ChevronLeft,
  Loader2,
  Send,
} from "lucide-react";

/** Формат цены в стиле RU */
const fmt = (n: number | string, currency = "RUB") => {
  const num = typeof n === "string" ? Number(n) : n;
  const txt = new Intl.NumberFormat("ru-RU").format(num);
  return currency === "RUB" ? `${txt} ₽` : `${txt} ${currency}`;
};

export default function DemoCheckout() {
  const sp = useSearchParams();
  const router = useRouter();

  const title = sp.get("title") ?? "Премиальный курс";
  const amount = sp.get("amount") ?? "0";
  const currency = sp.get("currency") ?? "RUB";
  const pi = sp.get("pi") ?? "";

  const [submitting, setSubmitting] = useState(false);

  const benefits = useMemo(
    () => [
      {
        icon: CheckCircle2,
        title: "Структурная методика",
        text:
          "Модульная программа без воды: от базы к уверенной практике. Чёткие чек-листы и алгоритмы раскладов.",
      },
      {
        icon: Crown,
        title: "Авторские разборы",
        text:
          "Покажем логику интерпретаций на реальных кейсах — чтобы вы могли сразу применять в консультациях.",
      },
      {
        icon: Users,
        title: "Комьюнити и наставник",
        text:
          "Закрытый чат, регулярная обратная связь и поддержка наставника — не останетесь один на один с вопросами.",
      },
      {
        icon: Star,
        title: "Портфолио и монетизация",
        text:
          "Готовые шаблоны, скрипты, примеры профилей и упаковки. Помогаем превратить знания в оплачиваемую практику.",
      },
    ],
    []
  );

  const trust = useMemo(
    () => [
      { icon: ShieldCheck, text: "Гарантия чёткой структуры и этики" },
      { icon: Lock, text: "Прозрачные условия участия без скрытых платежей" },
      { icon: Clock, text: "Доступ открываем сразу после оплаты" },
    ],
    []
  );

  async function pay() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const qp = new URLSearchParams({
      pi,
      title,
      amount: amount.toString(),
      currency,
    });
    router.push(`/success?${qp.toString()}`);
  }

  function back() {
    router.push("/");
  }

  // форма вопроса
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  async function sendQuestion(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSent(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          question: form.question,
          courseTitle: title,
          amount,
          currency,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent("ok");
      setForm({ name: "", email: "", phone: "", question: "" });
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      {/* Шапка */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-[#eadfcf]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #e9dcc5, #d1b582, #b98d4e, #e9dcc5)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            />
            <div className="text-[#3c2f1e] tracking-tight font-medium">
              Angela Pearl — Касса
            </div>
          </div>
          <button
            onClick={back}
            className="inline-flex items-center gap-2 text-sm text-[#5b4a33] hover:opacity-75"
            aria-label="Вернуться на сайт"
          >
            <ChevronLeft className="h-4 w-4" />
            Вернуться
          </button>
        </div>
      </header>

      {/* Контент */}
      <main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-5 gap-8">
        {/* Левая колонка */}
        <section className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-[#eadfcf] bg-white/80 backdrop-blur-md p-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/70 px-3 py-1 text-xs text-[#6b5a43]">
              <Star className="h-3.5 w-3.5" />
              Новый набор — количество мест ограничено
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl tracking-tight text-[#2f2619] font-semibold">
              Доступ к программе: {title}
            </h1>
            <p className="mt-3 text-[#5b4a33] text-base leading-relaxed max-w-2xl">
              Присоединяйтесь к премиальной программе от Angela Pearl и получите
              <span className="font-medium"> практический навык с чёткой логикой интерпретаций</span>.
              Уже в первый месяц вы начнёте делать уверенные разборы и формировать портфолио для клиентов.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => {
                const Ico = b.icon;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-[#eadfcf] bg-white/70 p-4"
                  >
                    <Ico className="h-5 w-5 text-[#3c2f1e]" />
                    <div className="mt-2 text-[#3c2f1e] font-medium">
                      {b.title}
                    </div>
                    <div className="text-sm text-[#6b5a43]">{b.text}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {[
                { k: "Выпускников", v: "700+" },
                { k: "Средняя оценка", v: "4.9/5" },
                { k: "Стран", v: "20+" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-[#eadfcf] bg-white/70 p-4 text-center"
                >
                  <div className="text-2xl text-[#3c2f1e] font-semibold">
                    {s.v}
                  </div>
                  <div className="text-xs text-[#6b5a43] mt-1">{s.k}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {trust.map((t, i) => {
                const Ico = t.icon;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-xl border border-[#eadfcf] bg-white/60 px-4 py-3 flex items-center gap-2"
                  >
                    <Ico className="h-4 w-4 text-[#3c2f1e]" />
                    <div className="text-xs text-[#5b4a33]">{t.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Правая колонка */}
        <aside className="lg:col-span-2 space-y-6">
          <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="p-6 border-b border-[#eadfcf]">
              <CardTitle className="text-[#3c2f1e] text-lg">Заказ</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[#3c2f1e] font-medium">{title}</div>
                  <div className="text-xs text-[#6b5a43] mt-1">
                    Онлайн-доступ к материалам и чату
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl text-[#3c2f1e] font-semibold">
                    {fmt(amount, currency)}
                  </div>
                  <div className="text-xs text-[#6b5a43]">Разовый платёж</div>
                </div>
              </div>

              <div className="my-4 h-px bg-[#eadfcf]" />

              <ul className="space-y-2 text-sm text-[#5b4a33]">
                {[
                  "Доступ ко всем урокам выбранной программы",
                  "Методические материалы и чек-листы",
                  "Практические разборы и кейсы",
                  "Закрытый чат и поддержка наставника",
                  "Сертификат об окончании",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-[2px] text-[#3c2f1e]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl border border-[#eadfcf] bg-white/70 p-3 text-xs text-[#5b4a33] flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-[#3c2f1e]" />
                <div>
                  <div className="text-[#3c2f1e] font-medium">Честные условия</div>
                  <div>
                    Если после первого модуля вы поймёте, что формат не подходит — напишите нам, найдём решение.
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 w-full rounded-xl text-base py-6"
                style={{
                  background:
                    "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                  color: "#2f271a",
                  boxShadow: "0 16px 36px rgba(191,150,93,0.35)",
                }}
                onClick={pay}
                disabled={submitting}
                aria-label="Оплатить и получить доступ"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Обработка…
                  </>
                ) : (
                  <>Оплатить и получить доступ</>
                )}
              </Button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#6b5a43]">
                <Lock className="h-3.5 w-3.5" />
                Демо-режим — списаний нет
              </div>
            </CardContent>
          </Card>

          {/* Форма вопроса */}
          <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="p-6 border-b border-[#eadfcf]">
              <CardTitle className="text-[#3c2f1e] text-lg">
                Задать вопрос
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sent === "ok" ? (
                <div className="text-[#3c2f1e] font-medium">
                  Спасибо! Ваш вопрос отправлен.
                </div>
              ) : (
                <form onSubmit={sendQuestion} className="space-y-4">
                  <input
                    required
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-[#eadfcf] bg-white/70 px-3 py-2 text-sm text-[#3c2f1e]"
                  />
                  <input
                    required
                    type="email"
                    placeholder="E-mail"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#eadfcf] bg-white/70 px-3 py-2 text-sm text-[#3c2f1e]"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Телефон"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#eadfcf] bg-white/70 px-3 py-2 text-sm text-[#3c2f1e]"
                  />
                  <textarea
                    required
                    placeholder="Ваш вопрос"
                    value={form.question}
                    onChange={(e) =>
                      setForm({ ...form, question: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#eadfcf] bg-white/70 px-3 py-2 text-sm text-[#3c2f1e] min-h-[100px]"
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-xl py-5 text-base"
                    style={{
                      background:
                        "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                      color: "#2f271a",
                      boxShadow: "0 8px 24px rgba(191,150,93,0.35)",
                    }}
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Отправка…
                      </>
                    ) : (
                      <>
                        Отправить вопрос <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {sent === "err" && (
                    <div className="text-red-700 text-sm">
                      Не удалось отправить. Попробуйте позже.
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>

      <footer className="border-t border-[#eadfcf] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-[#6b5a43] flex items-center justify-between">
          <div>© {new Date().getFullYear()} Angela Pearl Academy</div>
          <div className="flex items-center gap-4">
            <span>Политика конфиденциальности</span>
            <span>Пользовательское соглашение</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
