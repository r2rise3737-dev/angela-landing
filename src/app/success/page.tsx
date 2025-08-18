"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Success() {
  const sp = useSearchParams();
  const router = useRouter();
  const title = sp.get("title") ?? "Оплата";
  const amount = sp.get("amount") ?? "0";
  const currency = sp.get("currency") ?? "RUB";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] p-6">
      <div className="rounded-2xl border border-[#eadfcf] bg-white/80 backdrop-blur-md p-8 max-w-md text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-700" />
        </div>
        <h1 className="text-2xl text-[#3c2f1e] font-semibold mb-2">Оплата успешна (демо)</h1>
        <div className="text-[#5b4a33] mb-2">Курс: <span className="text-[#3c2f1e] font-medium">{title}</span></div>
        <div className="text-[#3c2f1e] text-lg font-medium mb-6">{amount} {currency}</div>
        <Button className="rounded-xl" onClick={() => router.push("/")}>Вернуться на главную</Button>
      </div>
    </div>
  );
}
