"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Play, Star, ShieldCheck, Check, ArrowRight, Sparkles,
  BookOpen, MoonStar, MessageCircle, Clock,
  ChevronRight, Mail, Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  duration: string;
  points: string[];
  highlight?: boolean;
};

const ANGELA_IMG = "/photo_2025-08-16_21-20-50.jpg"; // public/

const tarotCourses: Course[] = [
  { id: "t1", title: "Таро с нуля: базовая система", level: "Старт", price: 5500, duration: "4 недели", points: ["Младшие и Старшие арканы без воды","Чёткие расклады для быта и бизнеса","Практика на реальных кейсах"] },
  { id: "t2", title: "Профи-интерпретация раскладов", level: "Middle", price: 12000, duration: "6 недель", points: ["Глубина значения арканов","Комбинации и психологические связки","Этика консультирования"] },
  { id: "t3", title: "Расклады для отношений и денег", level: "Практика", price: 18000, duration: "6 недель", points: ["Авторские схемы на отношения","Финансовые сценарии и риски","Работа с запросами клиентов"] },
  { id: "t4", title: "Таро для блогеров и брендов", level: "Продвинутый", price: 26000, duration: "5 недель", points: ["Контент-расклады для соцсетей","Лёгкая подача и этика публичности","Портфолио таролога"] },
  { id: "t5", title: "Мастер-уровень: диагностика и стратегия", level: "Pro", price: 35000, duration: "8 недель", points: ["Стратегические расклады","Сложные случаи и разборы","Супервизия от наставника"], highlight: true },
];

const astroCourses: Course[] = [
  { id: "a1", title: "Астрология с нуля", level: "Старт", price: 6500, duration: "4 недели", points: ["Планеты, дома, аспекты","Как читать натальную карту","Быстрый разбор для себя"] },
  { id: "a2", title: "Профи-разбор натальных карт", level: "Middle", price: 14000, duration: "6 недель", points: ["Сильные и слабые зоны","Карьерные и финансовые векторы","Коммуникация с клиентом"] },
  { id: "a3", title: "Синастрия и совместимость", level: "Практика", price: 20000, duration: "5 недель", points: ["Любовные и деловые союзы","Конфликты и точки роста","Жизненные стратегии пары"] },
  { id: "a4", title: "Прогностика: транзиты и хорар", level: "Продвинутый", price: 27000, duration: "6 недель", points: ["Сроки событий","Транзиты и дирекции понятно","Хорарные вопросы"] },
  { id: "a5", title: "Астрология для блога и бизнеса", level: "Pro", price: 33000, duration: "6 недель", points: ["Контент-план по звёздам","Продукт-линейка и запуски","Календарь удачных дат"], highlight: true },
];

const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

function getCheckoutHref(c: Course) {
  const q = new URLSearchParams({
    courseId: c.id,
    title: c.title,
    amount: String(c.price),
    currency: "RUB",
    demo: "1",
    source: "course-card",
  });
  return `/api/payments/create-intent?${q.toString()}`;
}

function CourseCard({ course, accent }: { course: Course; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <Card
        className={`group relative overflow-hidden border-0 shadow-lg rounded-2xl bg-white/70 backdrop-blur-md ${accent ? "ring-1 ring-[#d3b37b]" : ""}`}
        style={{ backgroundImage:"radial-gradient(1200px 400px at 10% -10%, rgba(232,220,198,0.45), transparent), radial-gradient(800px 300px at 110% 10%, rgba(233,226,212,0.5), transparent)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ background:"radial-gradient(400px 200px at 20% 0%, rgba(223,199,154,0.25), transparent)" }} />
        <CardHeader className="p-6">
          <CardTitle className="text-xl tracking-tight text-[#3c2f1e] font-medium">{course.title}</CardTitle>
          <div className="mt-2 flex items-center gap-3 text-sm text-[#6b5a43]">
            <span className="px-2 py-1 rounded-full bg-[#f2ebdf] border border-[#eadfcf]">{course.level}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ul className="space-y-2 text-[#4a3e2c]">
            {course.points.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-5 w-5 mt-[2px]" />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-2xl text-[#3c2f1e] font-semibold tracking-tight">{formatPrice(course.price)}</div>
            <Button
              asChild
              className="rounded-xl px-5"
              style={{
                background:"linear-gradient(180deg, #e7d6b2 0%, #d5bb8a 40%, #c39f61 100%)",
                color:"#2e2619",
                boxShadow:"0 8px 24px rgba(195,159,97,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <Link href={getCheckoutHref(course)} prefetch={false} rel="nofollow">
                Получить доступ <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function runDevTests() {
  try {
    const groups = [
      { name: "tarot", data: tarotCourses },
      { name: "astro", data: astroCourses },
    ];
    console.assert(groups[0].data.length === 5, "Tarot: ожидалось 5 курсов");
    console.assert(groups[1].data.length === 5, "Astro: ожидалось 5 курсов");
    for (const g of groups) {
      let hasHighlight = false;
      for (const c of g.data) {
        console.assert(typeof c.id === "string" && c.id, `${g.name}: id обязателен`);
        console.assert(typeof c.title === "string" && c.title.length > 2, `${g.name}:${c.id} некорректный title`);
        console.assert(typeof c.level === "string" && c.level, `${g.name}:${c.id} level обязателен`);
        console.assert(typeof c.price === "number" && c.price >= 5500 && c.price <= 35000, `${g.name}:${c.id} price вне диапазона 5500–35000`);
        console.assert(typeof c.duration === "string" && c.duration, `${g.name}:${c.id} duration обязателен`);
        console.assert(Array.isArray(c.points) && c.points.length >= 3, `${g.name}:${c.id} минимум 3 bullets`);
        console.assert(c.points.every((p: string) => typeof p === "string" && p.length > 0), `${g.name}:${c.id} пустые bullets`);
        hasHighlight = hasHighlight || !!c.highlight;
      }
      console.assert(hasHighlight, `${g.name}: нужен хотя бы один highlight=true`);
    }
    console.assert(/\.(jpg|jpeg|png)$/i.test(ANGELA_IMG), "ANGELA_IMG должен быть jpg/png");
    console.log("[DEV TESTS] Все проверки пройдены ✔");
  } catch (e) {
    console.error("[DEV TESTS] Ошибка проверок:", e);
  }
}

export default function AngelaPearlLanding() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);

  const [track, setTrack] = useState<"tarot" | "astro">("tarot");

  // ====== АНИМАЦИЯ HERO ======
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let timer: any = null;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const fit = () => {
      const p = canvas.parentElement!;
      const w = p.clientWidth, h = p.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    // ---- Звёзды ----
    type Star = { x:number; y:number; r:number; twinkle:boolean; phase:number; omega:number; baseA:number; glow:number; };
    const stars: Star[] = [];
    const seedStars = () => {
      stars.length = 0;
      const p = canvas.parentElement!;
      const w = p.clientWidth, h = p.clientHeight;
      const N = 160;
      for (let i = 0; i < N; i++) {
        const tw = Math.random() < 0.3; // 30% — яркие "дышащие"
        stars.push({
          x: Math.random()*w,
          y: Math.random()*h*0.9,
          r: tw ? (1.2 + Math.random()*1.2) : (0.6 + Math.random()*0.8),
          twinkle: tw,
          phase: Math.random()*Math.PI*2,
          omega: 0.4 + Math.random()*0.8, // рад/с (медленное дыхание)
          baseA: tw ? 0.6 : 0.28,
          glow: tw ? 8 + Math.random()*8 : 0,
        });
      }
    };
    seedStars();

    // ---- Падающая звезда (точно поверх статичной линии, вправо-вниз) ----
    type Meteor = { active:boolean; x:number; y:number; vx:number; vy:number; life:number; };
    let meteor: Meteor = { active:false, x:0, y:0, vx:0, vy:0, life:0 };

    const spawnMeteor = () => {
      const p = canvas.parentElement!;
      const w = p.clientWidth, h = p.clientHeight;

      const sx = w*0.78, sy = h*0.12;
      const ex = w*0.92, ey = h*0.30;

      const dx = ex - sx, dy = ey - sy;
      const len = Math.hypot(dx, dy);
      const ux = dx/len, uy = dy/len;

      const pxPerFrame = 8; // скорость
      meteor = {
        active: true,
        x: sx,
        y: sy,
        vx: ux * pxPerFrame,
        vy: uy * pxPerFrame,
        life: (len / pxPerFrame) / 60 + 0.3,
      };
    };

    timer = setInterval(spawnMeteor, 10000);
    setTimeout(spawnMeteor, 1200);

    // ---- Рендер ----
    const draw = (ms: number) => {
      const t = ms/1000;
      const p = canvas.parentElement!;
      const w = p.clientWidth, h = p.clientHeight;

      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0.00,"rgba(213,195,235,0.30)");
      grad.addColorStop(0.55,"rgba(248,245,239,0.22)");
      grad.addColorStop(0.75,"rgba(248,245,239,0.50)");
      grad.addColorStop(0.92,"rgba(248,245,239,0.78)");
      grad.addColorStop(1.00,"rgba(248,245,239,0.98)");
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);

      // Звёзды
      for (const s of stars) {
        let alpha = s.baseA;
        if (s.twinkle) {
          const k = 0.5 + 0.5*Math.sin(s.phase + t*s.omega);
          alpha = 0.6 + 0.4*k;
          ctx.save();
          ctx.globalAlpha = alpha*0.9;
          ctx.shadowBlur = s.glow;
          ctx.shadowColor = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.restore();
          continue;
        }
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Падающая звезда — поверх статичной, без лишних «полос»
      if (meteor.active) {
        meteor.life -= 1/60;
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        const tail = 46;
        const angle = Math.atan2(meteor.vy, meteor.vx);
        for (let i=0; i<tail; i++){
          const t0 = i/tail;
          const dx = Math.cos(angle)*(-i*1.7);
          const dy = Math.sin(angle)*(-i*1.7);
          ctx.save();
          ctx.globalAlpha = (1 - t0) * Math.max(0, Math.min(1, meteor.life));
          ctx.shadowBlur = 10*(1 - t0);
          ctx.shadowColor = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(meteor.x + dx, meteor.y + dy, 1.2 + (1 - t0)*1.8, 0, Math.PI*2);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.restore();
        }

        if (meteor.life <= 0 || meteor.x > w+50 || meteor.y > h+50) {
          meteor.active = false;
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => { if (typeof window !== "undefined") runDevTests(); }, []);

  const features: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: BookOpen, title: "Методика", text: "Структурно, без лишнего" },
    { icon: MoonStar, title: "Практика", text: "Каждый модуль — разбор" },
    { icon: ShieldCheck, title: "Поддержка", text: "Наставник и чат" },
    { icon: MessageCircle, title: "Коммьюнити", text: "Обмен заявками" },
  ];

  function scrollToCourses() {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitLead() {
    try {
      setSending(true); setSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, question }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent("ok"); setEmail(""); setPhone(""); setQuestion("");
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  const currentCourses = track === "tarot" ? tarotCourses : astroCourses;

  return (
    <div className="min-h-screen w-full" style={{ background: "#f8f5ef" }}>
      {/* Навбар */}
      <header className="sticky top-0 z-40 border-b border-[#eadfcf]/80 backdrop-blur-xl bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl" style={{ background:"conic-gradient(from 180deg at 50% 50%, #e9dcc5, #d1b582, #b98d4e, #e9dcc5)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.7)" }}/>
            <div className="text-[#3c2f1e] tracking-tight">Angela Pearl — Академия</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#5b4a33]">
            <a href="#courses" className="hover:opacity-70">Курсы</a>
            <a href="#about" className="hover:opacity-70">Об авторе</a>
            <a href="#reviews" className="hover:opacity-70">Отзывы</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
            <a href="#contact" className="hover:opacity-70">Контакты</a>
          </nav>
          <Button
            className="rounded-xl px-4 py-2 text-sm"
            style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
            onClick={scrollToCourses}
          >
            Получить доступ
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden rounded-b-[28px]">
          <video
            className="h-[72vh] w-full object-cover"
            autoPlay muted loop playsInline
            poster="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
          />
          <div className="absolute inset-0"
               style={{ background:"linear-gradient(180deg, rgba(248,245,239,0.00) 0%, rgba(248,245,239,0.28) 58%, rgba(248,245,239,0.52) 76%, rgba(248,245,239,0.90) 100%)" }} />
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/70 px-3 py-1 text-xs text-[#6b5a43] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> Запуск нового набора — места ограничены
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl leading-tight tracking-tight text-[#2f2619] font-semibold">Премиальные курсы Таро и Астрологии</h1>
            <p className="mt-4 text-[#5b4a33] text-base md:text-lg max-w-2xl">
              Эксклюзивные авторские программы Angela Pearl: ясная структура, глубокие инсайты и пошаговое сопровождение.
              Получите знания, которые превращаются в уверенную практику и востребованную профессию.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button className="rounded-xl px-5 py-5 text-base"
                style={{background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a", boxShadow:"0 16px 36px rgba(191,150,93,0.35)"}}
                onClick={scrollToCourses}>
                Выбрать программу <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="rounded-xl px-5 py-5 text-base border-[#d9c6a2] text-[#3c2f1e]">
                Смотреть презентацию <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-[#6b5a43]">
              <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Сертификат об окончании</div>
              <div className="flex items-center gap-1"><Star className="h-4 w-4" /> Практика на живых кейсах</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* КАТАЛОГ */}
      <section id="courses" className="mx-auto max-w-7xl px-4 py-16 scroll-mt-24">
        <div className="mb-4">
          <h2 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Программы обучения</h2>
        </div>

        <div className="flex items-center gap-3 mb-4" role="tablist" aria-label="Направления обучения">
          <div className="text-[#6b5a43] mr-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Направление:</span>
          </div>

          <Button role="tab" aria-selected={track === "tarot"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "tarot" ? "" : "border border-[#d9c6a2] bg-white/80 text-[#3c2f1e]"}`}
            style={track === "tarot" ? { background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" } : undefined}
            onClick={() => setTrack("tarot")}
          >Таро</Button>

          <Button role="tab" aria-selected={track === "astro"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "astro" ? "" : "border border-[#d9c6а2] bg-white/80 text-[#3c2f1e]"}`}
            style={track === "astro" ? { background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" } : undefined}
            onClick={() => setTrack("astro")}
          >Астрология</Button>
        </div>

        <div className="mb-8 text-sm text-[#6b5a43]">Технологичный формат: видео-уроки, живые разборы, чат-поддержка</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((c) => (
            <CourseCard key={c.id} course={c} accent={c.highlight} />
          ))}
        </div>
      </section>

      {/* ОБ АВТОРЕ */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-[#eadfcf] bg-white/70 p-1">
              <div id="angela-portrait" className="aspect-[4/3] w-full rounded-xl overflow-hidden shadow-lg"
                   style={{ backgroundImage:`url(${ANGELA_IMG})`, backgroundSize:"cover", backgroundPosition:"top center", filter:"contrast(1.05) brightness(1.02)" }}/>
            </div>
          </div>
          <div>
            <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Angela Pearl</h3>
            <p className="mt-4 text-[#5b4a33] leading-relaxed">
              Международный консультант и автор методик по Таро и Астрологии.
              Более 20 лет практики и сотни специалистов по всему миру.
              Чёткая структура обучения, уважение к этике профессии и фокус на практике — без лишнего.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { k: "Специалистов", v: "700+" },
                { k: "Стран", v: "20+" },
                { k: "Лет практики", v: "20+" },
              ].map((i) => (
                <div key={i.k} className="rounded-xl border border-[#eadfcf] p-4 text-center shadow-sm hover:shadow-md transition-shadow bg-white/70">
                  <div className="text-2xl text-[#3c2f1e] font-semibold">{i.v}</div>
                  <div className="text-xs text-[#6b5a43] mt-1">{i.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 640px){ #angela-portrait{ background-position:center center !important; }}`}</style>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Отзывы выпускников Академии</h3>
          <p className="text-[#5b4a33] mt-2">Подтверждённые отзывы практикующих специалистов — о качестве подготовки и результатах в работе с клиентами.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Анна В.", role: "Ученица Академии Angela Pearl", text: "С первого месяца начала брать консультации. Материал структурный, без воды — быстро вышла на стабильный поток клиентов." },
            { name: "Марина К.", role: "Таролог из нового потока", text: "Понравилась система разборов: после каждого блока есть практика и обратная связь. Это сильно ускоряет рост." },
            { name: "Алексей Р.", role: "Астролог и консультант клиентов", text: "Глубокие методики + этика работы с запросом. Чётко, уважительно к клиенту — и результаты заметны." },
          ].map((p, i) => (
            <Card key={i} className="border-0 rounded-2xl bg-white/70 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e9e0cf] flex items-center justify-center text-[#3c2f1e] font-medium">{p.name[0]}</div>
                  <div className="text-sm"><div className="text-[#3c2f1e]">{p.name}</div><div className="text-[#6b5a43] text-xs">{p.role}</div></div>
                </div>
                <p className="mt-4 text-[#4a3e2c] leading-relaxed">«{p.text}»</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA + ФОРМА */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl border border-[#eadfcf] bg-white/70 p-8">
          <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full opacity-30" style={{background:"radial-gradient(circle, #ead9b8, #d5bb8a)", filter:"blur(20px)"}}/>
          <div className="grid lg:grid-cols-2 gap-8 items-center relative">
            <div>
              <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Присоединиться к набору</h3>
              <p className="mt-3 text-[#5b4a33]">Оставьте контакты — ответим на вопросы и поможем выбрать программу.</p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Mail className="h-4 w-4 text-[#6b5a43]" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ваш email" className="border-0 focus-visible:ring-0 text-[#3c2f1e]" />
                </div>
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Phone className="h-4 w-4 text-[#6b5a43]" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон (опционально)" className="border-0 focus-visible:ring-0 text-[#3c2f1е]" />
                </div>
                <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Короткий вопрос (опционально)" className="border-[#e0d4bf] text-[#3c2f1e]" />
                <div className="flex items-center gap-3">
                  <Button className="rounded-xl px-5 py-5 text-base" style={{background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"}} onClick={submitLead} disabled={sending}>
                    {sending ? "Отправляем..." : "Получить доступ"}
                  </Button>
                  <div className="text-xs text-[#6b5a43]">Нажимая, вы соглашаетесь с политикой обработки данных</div>
                </div>
                {sent === "ok" && <div className="text-green-700 text-sm mt-2">Спасибо! Заявка отправлена — проверьте канал/бот.</div>}
                {sent === "err" && <div className="text-red-700 text-sm mt-2">Не удалось отправить. Попробуйте позже.</div>}
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => {
                  const Icon = f.icon as LucideIcon;
                  return (
                    <div key={i} className="rounded-2xl border border-[#eadfcf] bg-white/70 p-4">
                      <Icon className="h-5 w-5 text-[#3c2f1e]" />
                      <div className="mt-2 text-[#3c2f1e] font-medium">{f.title}</div>
                      <div className="text-sm text-[#6b5a43]">{f.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-2xl border border-[#eadfcf] bg-white/70 p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-2xl tracking-tight text-[#2f2619] font-semibold">Остались вопросы?</h4>
              <p className="text-[#6b5a43] mt-1">Напишите в поддержку — ответим оперативно.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-[#d9c6a2] text-[#3c2f1e]">Написать в чат</Button>
              <Button
                className="rounded-xl"
                style={{background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"}}
                onClick={scrollToCourses}
              >
                Получить доступ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-[#eadfcf] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#6b5a43]">© {new Date().getFullYear()} Angela Pearl Academy</div>
          <div className="text-xs text-[#6b5a43] flex items-center gap-4">
            <a href="#" className="hover:opacity-70">Политика конфиденциальности</a>
            <a href="#" className="hover:opacity-70">Договор оферты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
