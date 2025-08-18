"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Check } from "lucide-react";

export default function CheckoutClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const title = sp.get("title") ?? "Доступ к программе";
  const amount = Number(sp.get("amount") ?? 9900);
  const currency = sp.get("currency") ?? "RUB";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  const priceFmt = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);

  const handlePay = () => {
    router.push(`/success?title=${encodeURIComponent(title)}&amount=${amount}&currency=${currency}`);
  };

  async function submitQuestion() {
    try {
      setSending(true); setSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, question, page: "demo-checkout" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent("ok");
      setEmail(""); setPhone(""); setQuestion("");
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background:"#f8f5ef" }}>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="border-0 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl text-[#2f2619] tracking-tight">Оформление доступа</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-[#eadfcf] bg-white/70 p-5">
                  <div className="text-[#3c2f1e] text-xl font-semibold">{title}</div>
                  <div className="mt-2 text-[#6b5a43] text-sm">
                    Доступ к материалам, живые разборы, коммьюнити и сопровождение наставника.
                  </div>
                  <ul className="mt-4 space-y-2 text-[#4a3e2c]">
                    {[
                      "Моментальное открытие доступа после оплаты",
                      "Практические модули + разборы кейсов",
                      "Чёткая методика без воды, акцент на результат",
                      "Поддержка в чате и чек-листы по шагам",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 mt-[2px]" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-xl border border-[#eadfcf] bg-white/70 p-5">
                  <div className="text-[#2f2619] font-semibold">Задать вопрос</div>
                  <div className="grid gap-3 mt-3">
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-[#3c2f1e]" />
                    <Input placeholder="Телефон (опционально)" value={phone} onChange={(e) => setPhone(e.target.value)} className="text-[#3c2f1e]" />
                    <Textarea placeholder="Ваш вопрос" value={question} onChange={(e) => setQuestion(e.target.value)} className="text-[#3c2f1e]" />
                    <Button
                      onClick={submitQuestion}
                      disabled={sending}
                      className="rounded-xl"
                      style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
                    >
                      {sending ? "Отправляем..." : "Отправить"}
                    </Button>
                    {sent === "ok" && <div className="text-green-700 text-sm">Спасибо! Ваш вопрос отправлен.</div>}
                    {sent === "err" && <div className="text-red-700 text-sm">Не удалось отправить. Попробуйте позже.</div>}
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-xl border border-[#eadfcf] bg-white/70 p-5">
                  <div className="text-[#6b5a43] text-sm">К оплате</div>
                  <div className="mt-2 text-3xl text-[#2f2619] font-semibold">{priceFmt}</div>
                  <div className="mt-4 flex items中心 gap-2 text-[#6b5a43] text-sm">
                    <ShieldCheck className="h-4 w-4" /> Безопасное оформление (демо)
                  </div>
                  <Button
                    onClick={handlePay}
                    className="mt-5 w-full rounded-xl py-5 text-base"
                    style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
                  >
                    Оплатить и получить доступ
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
