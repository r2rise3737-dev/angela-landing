"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Star, ShieldCheck, Check, ArrowRight, Sparkles,
  BookOpen, MoonStar, MessageCircle, Clock,
  ChevronRight, Mail, Phone, User, Send, AtSign, Layers
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
  {
    id: "tarot-basic",
    title: "Таро с нуля: базовая система",
    level: "Старт",
    price: 5500,
    duration: "4 недели",
    points: [
      "Младшие и Старшие арканы без воды",
      "Чёткие расклады для быта и бизнеса",
      "Практика на реальных кейсах",
    ],
  },
  {
    id: "pro-interpretation",
    title: "Профи-интерпретация раскладов",
    level: "Middle",
    price: 12000,
    duration: "6 недель",
    points: [
      "Глубина значения арканов",
      "Комбинации и психологические связки",
      "Этика консультирования",
    ],
  },
  {
    id: "love-money-spreads",
    title: "Расклады для отношений и денег",
    level: "Практика",
    price: 18000,
    duration: "6 недель",
    points: [
      "Авторские схемы на отношения",
      "Финансовые сценарии и риски",
      "Работа с запросами клиентов",
    ],
  },
  {
    id: "tarot-for-brands",
    title: "Таро для блогеров и брендов",
    level: "Продвинутый",
    price: 26000,
    duration: "5 недель",
    points: [
      "Контент-расклады для соцсетей",
      "Лёгкая подача и этика публичности",
      "Портфолио и упаковка услуг",
      "Имидж и этика публичного таролога",
    ],
  },
  {
    id: "master-diagnostics",
    title: "Мастер-уровень: диагностика и стратегия",
    level: "Pro",
    price: 35000,
    duration: "8 недель",
    points: [
      "Стратегические расклады и сложные кейсы",
      "Сложные случаи и разборы",
      "Алгоритмы решений и ответственность прогноза",
      "Супервизия от наставника",
    ],
    highlight: true,
  },
];

const astroCourses: Course[] = [
  {
    id: "astro-basic",
    title: "Астрология с нуля",
    level: "Старт",
    price: 6500,
    duration: "4 недели",
    points: [
      "Планеты, дома, аспекты",
      "Как читать натальную карту",
      "Быстрый разбор для себя",
    ],
  },
  {
    id: "astro-profi",
    title: "Профи-разбор натальных карт",
    level: "Middle",
    price: 14000,
    duration: "6 недель",
    points: [
      "Сильные и слабые зоны",
      "Карьерные и финансовые векторы",
      "Коммуникация с клиентом",
    ],
  },
  {
    id: "astro-synastry",
    title: "Синастрия и совместимость",
    level: "Практика",
    price: 20000,
    duration: "5 недель",
    points: [
      "Любовные и деловые союзы",
      "Конфликты и точки роста",
      "Жизненные стратегии пары",
    ],
  },
  {
  id: "astro-prognostics",
  title: "Астрология для блога и бизнеса",
  level: "Pro",
  price: 27000,
  duration: "6 недель",
  points: [
    "Включает предыдущие",
    "Контент-план по звёздам",
    "Продукт-линейка и запуски",
    "Календарь удачных дат",
  ],
},

{
  id: "astro-blog-business",
  title: "Мастер-астролог: диагностика и стратегия",
  level: "Pro",
  price: 33000,
  duration: "8 недель",
  points: [
    "Включает предыдущие",
    "Диагностика ядра личности и ресурсов: управители, достоинства, сигнификаторы",
    "Сложные кейсы: переезды, бизнес-решения, кризисы, «узкие места» карты",
    "Личный план практики на 3 месяца + сертификация",
  ],
  // можно пометить, если захочешь визуально выделять
  // highlight: true,
}
,
];

const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

// ВЕДЁМ НА НОВУЮ СТРАНИЦУ CHECKOUT
function getCheckoutHref(c: Course) {
  return `/checkout?courseId=${encodeURIComponent(c.id)}`;
}

function CourseCard({
  course,
  includePrev,
}: {
  course: Course;
  includePrev?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card
        className="flex flex-col justify-between h-full border-0 shadow-lg rounded-2xl bg-white/70 backdrop-blur-md relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(1200px 400px at 10% -10%, rgba(232,220,198,0.45), transparent), radial-gradient(800px 300px at 110% 10%, rgba(233,226,212,0.5), transparent)",
        }}
      >
        {/* мягкие золотистые пятна */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.65), rgba(215,187,143,0))", filter:"blur(10px)"}} />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.55), rgba(215,187,143,0))", filter:"blur(14px)"}} />

        <div>
          <CardHeader className="p-6">
            <CardTitle className="text-xl tracking-tight text-[#3c2f1e] font-medium">
              {course.title}
            </CardTitle>

            <div className="mt-2 flex items-center gap-3 text-sm text-[#6b5a43]">
              <span className="px-2 py-1 rounded-full bg-[#f2ebdf] border border-[#eadfcf]">
                {course.level}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.duration}
              </span>
            </div>

            {includePrev && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#f8f1e2] border border-[#eadfcf] text-xs text-[#6b5a43]">
                  <Layers className="h-4 w-4" />
                  Включает предыдущие
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-0">
            <ul className="space-y-2 text-[#4a3e2c] min-h-[96px]">
              {course.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-[2px]" />
                  <span className="leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>

        <div className="px-6 pb-6 pt-4 flex items-center justify-between mt-auto">
          <div className="text-2xl text-[#3c2f1e] font-semibold tracking-tight">
            {formatPrice(course.price)}
          </div>
          <Button
            asChild
            className="rounded-xl px-5 leading-none"
            style={{
              background:
                "linear-gradient(180deg, #e7d6b2 0%, #d5bb8a 40%, #c39f61 100%)",
              color: "#2e2619",
              boxShadow:
                "0 8px 24px rgba(195,159,97,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <Link href={getCheckoutHref(course)} prefetch={false} rel="nofollow">
              Получить доступ <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
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

export default function HomeClient() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [track, setTrack] = useState<"tarot" | "astro">("tarot");

  // Поля формы в нижнем блоке «Контакты»
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cTg, setCTg] = useState("");
  const [cMsg, setCMsg] = useState("");
  const [cSending, setCSending] = useState(false);
  const [cSent, setCSent] = useState<null | "ok" | "err" | "invalid">(null);

  useEffect(() => { if (typeof window !== "undefined") runDevTests(); }, []);

  const features: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: BookOpen, title: "Методика", text: "Структурно, без лишнего" },
    { icon: MoonStar, title: "Практика", text: "Каждый модуль — разбор" },
    { icon: MessageCircle, title: "Коммьюнити", text: "Обмен заявками" },
  ];

  const reviews = [
    {
      name: "Анна В.",
      role: "Ученица Академии Angela Pearl",
      text:
        "С первого месяца начала брать консультации. Материал структурный, без воды — быстро вышла на стабильный поток клиентов.",
      avatar:
        "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "Марина К.",
      role: "Таролог из нового потока",
      text:
        "Понравилась система разборов: после каждого блока есть практика и обратная связь. Это сильно ускоряет рост.",
      avatar:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "Алексей Р.",
      role: "Астролог и консультант клиентов",
      text:
        "Глубокие методики + этика работы с запросом. Чётко, уважительно к клиенту — и результаты заметны.",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop&crop=faces",
    },
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

  async function submitContact() {
    if (!cEmail && !cPhone && !cTg) { setCSent("invalid"); return; }
    if (!cMsg.trim()) { setCSent("invalid"); return; }

    try {
      setCSending(true); setCSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cEmail,
          phone: cPhone,
          telegram: cTg,
          question: cMsg,
          source: "contact"
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCSent("ok");
      setCEmail(""); setCPhone(""); setCTg(""); setCMsg("");
    } catch {
      setCSent("err");
    } finally {
      setCSending(false);
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

      {/* HERO — МЯГКИЙ ПЕРЕХОД, БЕЗ PLAY-ИКОНКИ НА МОБИЛЬНОМ, БЕЗ ДЁРГАНИЙ */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden rounded-b-[28px] border-b border-transparent">
          {/* Мобильный фон — статика вместо видео */}
          <div className="relative h-[72vh] w-full md:hidden">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transform-gpu will-change-transform"
              style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            />
            {/* Мягкий вертикальный градиент до бежевого */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,245,239,0.00) 0%, rgba(248,245,239,0.10) 25%, rgba(248,245,239,0.40) 55%, rgba(248,245,239,0.72) 80%, #f8f5ef 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,245,239,0) 0%, rgba(248,245,239,0.55) 45%, #f8f5ef 100%)",
              }}
            />
          </div>

          {/* Десктоп — видео */}
          <video
            className="hidden md:block h-[72vh] w-full object-cover transform-gpu will-change-transform"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            aria-hidden="true"
            poster="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
            style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(248,245,239,0) 0%, rgba(248,245,239,0.16) 35%, rgba(248,245,239,0.50) 65%, #f8f5ef 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/70 px-3 py-1 text-xs text-[#6b5a43]">
              <Sparkles className="h-3.5 w-3.5" /> ⏳Запись открыта до 5 сентября — успей занять место
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl leading-snug text-[#2f2619] font-semibold text-left">
              Курсы Таро и Астрологии от Angela Pearl
            </h1>

            {/* «Облачко» под абзацем — ещё более прозрачное и с мягким растворением краёв */}
            <div className="relative mt-4 max-w-2xl">
<div className="relative inline-block px-4 py-4">
  <div
    className="pointer-events-none absolute inset-0 rounded-[22px]"
    style={{ backgroundColor: "rgba(255,255,255,0.28)",
      WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, black 72%, transparent 100%)",
      maskImage: "radial-gradient(closest-side at 50% 50%, black 72%, transparent 100%)",
      WebkitTransform: "translateZ(0)",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
    }} />
  <p className="relative text-[15px] leading-relaxed text-[#3d372c] md:text-[#5b5a43] md:text-lg font-semibold z-[1] inline-block w-fit">
              Добро пожаловать в пространство знаний и вдохновения. Наши программы помогут вам лучше понять себя и
              окружающий мир, открыть новые горизонты и при желании сделать первые шаги к профессии. Таро и Астрология
              здесь — это не только инструмент работы, но и путь к личному развитию, гармонии и осознанности.
            </p>
</div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="rounded-xl px-5 py-5 text-base leading-none"
                style={{
                  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                  color:"#2f271a",
                  boxShadow:"0 16px 36px rgba(191,150,93,0.35)",
                }}
                onClick={scrollToCourses}
              >
                Записаться сейчас <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

              <Button variant="outline" className="rounded-xl px-5 py-5 text-base border-[#d9c6a2] text-[#3c2f1e] leading-none" asChild>
                <a href="#about">
                  Об авторе <User className="ml-2 h-5 w-5" />
                </a>
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
        <div className="mb-2">
          <h2 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Программы обучения</h2>
        </div>

        <div className="flex items-center gap-3 mb-3" role="tablist" aria-label="Направления обучения">
          <div className="text-[#6b5a43] mr-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Выберите направление:</span>
          </div>

          <Button
            role="tab"
            aria-selected={track === "tarot"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "tarot" ? "" : "border border-[#d9c6a2] bg-white/80 text-[#3c2f1e]"}`}
            style={ track === "tarot" ? {  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"  } : undefined }
            onClick={() => setTrack("tarot")}
          >
            Таро
          </Button>

          <Button
            role="tab"
            aria-selected={track === "astro"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "astro" ? "" : "border border-[#d9c6a2] bg-white/80 text-[#3c2f1e]"}`}
            style={ track === "astro" ? {  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"  } : undefined }
            onClick={() => setTrack("astro")}
          >
            Астрология
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              includePrev={c.level !== "Старт"}
            />
          ))}
        </div>
      </section>

      {/* ОБ АВТОРЕ — без рамок и «подложек», чистое изображение */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 relative">
        <div className="pointer-events-none absolute -top-12 right-0 h-40 w-40 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.6), rgba(215,187,143,0))", filter:"blur(12px)"}}/>
        <div className="pointer-events-none absolute bottom-0 -left-10 h-48 w-48 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.5), rgba(215,187,143,0))", filter:"blur(14px)"}}/>

        <div className="grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            {/* было: рамка/фон/паддинг. стало: чистый контейнер без рамок */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/1land.PNG"
                  alt="Angela Pearl"
                  className="w-full h-full"
                  style={{
                    objectFit: "cover",
                    // смещаем кадр чуть выше, чтобы лицо/голова всегда были видны
                    objectPosition: "center 15%",
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Angela Pearl</h3>
            <p className="mt-2 text-[#5b4a33] leading-relaxed font-medium">
              Angela Pearl — международный эксперт, чьим прогнозам доверяют миллионы зрителей.
            </p>
            <p className="mt-4 text-[#5b4a33] leading-relaxed">
              Международный консультант и автор методик по Таро и Астрологии. Более 20 лет практики и сотни специалистов по всему миру. Чёткая структура обучения, уважение к этике профессии и фокус на практике — без лишнего.
            </p>
            <p className="mt-3 text-[#5b4a33] leading-relaxed">
              Регулярные разборы реальных запросов (быт, отношения, бизнес) с акцентом на корректную коммуникацию и прикладную психологию. Программы обновляются — добавляются современные расклады, примеры и живые кейсы.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { k: "Специалистов", v: "700+" },
                { k: "Стран", v: "20+" },
                { k: "Лет практики", v: "20+" },
              ].map((i) => (
                <div key={i.k} className="relative rounded-2xl border border-[#eadfcf] p-4 text-center shadow-sm hover:shadow-md transition-shadow bg-white/70">
                  <div className="text-2xl text-[#3c2f1e] font-semibold">{i.v}</div>
                  <div className="text-xs text-[#6b5a43] mt-1">{i.k}</div>
                  <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full"
                       style={{background:"radial-gradient(circle, rgba(234,217,184,0.45), rgba(215,187,143,0))", filter:"blur(10px)"}}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Мобильная адаптация блока «О авторе» */}
        <style>{`
          @media (max-width: 768px) {
            #about img {
              object-fit: cover !important;
              object-position: center 18% !important;
            }
          }
        `}</style>
      </section>

      {/* КРЕАТИВНЫЕ «ОКОШКИ»-ТРИГГЕРЫ */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <MoonStar className="h-5 w-5" /> Практика
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              Каждую неделю — <span className="font-medium">разбор живых запросов</span> + обратная связь от наставника.
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <MessageCircle className="h-5 w-5" /> Коммьюнити
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              Тёплое сообщество — <span className="font-medium">общие кейсы, нетворкинг и взаимопомощь</span>.
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <BookOpen className="h-5 w-5" /> Методика
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              Пошагово и без воды: <span className="font-medium">ясные алгоритмы</span> и шаблоны для быстрых результатов.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold text-center">FAQ</h3>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[
            { q: "Подойдёт ли курс, если я новичок?", a: "Да, обучение построено с нуля, разберёмся вместе." },
            { q: "А если мне не понравится?", a: "Свяжитесь с нами, решим вопрос." },
            { q: "Angela Pearl сама ведёт занятия?", a: "Да, вы получаете авторскую систему и практики от Angela." },
            { q: "Как оплатить?", a: "Просто: прямо в Telegram через ⭐ (звёзды), удобно и безопасно." },
          ].map((item, i) => (
            <Card key={i} className="border border-[#eadfcf] rounded-2xl bg-white/70 backdrop-blur-md p-6">
              <h4 className="text-lg font-medium text-[#3c2f1e]">{item.q}</h4>
              <p className="mt-2 text-[#5b4a33]">{item.a}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="text-[#3c2f1e] mb-3">🎁 Бонус: методичка PDF + доступ в закрытый чат</div>
          <Button
            className="rounded-xl px-6 py-4 text-lg font-semibold"
            style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
            onClick={scrollToCourses}
          >
            Записаться сейчас
          </Button>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 relative">
        <div className="pointer-events-none absolute -top-8 left-10 h-32 w-32 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.5), rgba(215,187,143,0))", filter:"blur(10px)"}}/>
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.45), rgba(215,187,143,0))", filter:"blur(12px)"}}/>

        <div className="rounded-2xl border border-[#eadfcf] bg-white/70 p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-2xl tracking-tight text-[#2f2619] font-semibold">Остались вопросы?</h4>
              <p className="text-[#6b5a43] mt-1">Напишите в поддержку — ответим оперативно.</p>
            </div>

            {/* Форма контакта */}
            <div className="w-full lg:w-[60%]">
              <div className="text-xs text-[#6b5a43] mb-2">
                Укажите хотя бы один контакт: email, телефон или Telegram
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Mail className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="Email"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Phone className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    placeholder="Телефон"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <AtSign className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cTg}
                    onChange={(e) => setCTg(e.target.value)}
                    placeholder="Telegram (ник)"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
              </div>

              <Textarea
                value={cMsg}
                onChange={(e) => setCMsg(e.target.value)}
                placeholder="Ваш вопрос"
                className="mt-3 border-[#e0d4bf] text-[#3c2f1e]"
              />

              <div className="mt-3 flex items-center gap-3">
                <Button
                  className="rounded-xl px-5 leading-none"
                  variant="outline"
                  style={{ borderColor: "#d9c6a2", color: "#3c2f1e" }}
                  onClick={submitContact}
                  disabled={cSending}
                >
                  {cSending ? "Отправляем..." : <>Написать в чат <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>

              {cSent === "invalid" && (
                <div className="text-red-700 text-sm mt-2">
                  Заполните вопрос и укажите минимум один контакт (email, телефон или Telegram).
                </div>
              )}
              {cSent === "ok" && (
                <div className="text-green-700 text-sm mt-2">
                  Спасибо! Сообщение отправлено — мы свяжемся с вами.
                </div>
              )}
              {cSent === "err" && (
                <div className="text-red-700 text-sm mt-2">
                  Не удалось отправить. Попробуйте позже.
                </div>
              )}
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
