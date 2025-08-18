"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  const sp = useSearchParams();
  const title = sp.get("title") ?? "Доступ к программе";
  const amount = Number(sp.get("amount") ?? 0);
  const priceFmt = new Intl.NumberFormat("ru-RU", { style:"currency", currency:"RUB", maximumFractionDigits:0 }).format(amount);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:"#f8f5ef"}}>
      <div className="rounded-2xl border border-[#eadfcf] bg-white/80 backdrop-blur-md p-8 text-center max-w-md">
        <div className="text-2xl text-[#2f2619] font-semibold">Доступ открыт</div>
        <div className="mt-2 text-[#6b5a43]">«{title}» — {priceFmt}</div>
        <div className="mt-6">
          <Button asChild className="rounded-xl"
            style={{background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"}}
          >
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
