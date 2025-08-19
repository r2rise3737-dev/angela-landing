"use client";

import { useMemo } from "react";

/**
 * Анимированное небо для секции HERO.
 * - ~30% звёзд мягко сияют (не "мигалки").
 * - Одна "падающая" звезда летит вправо-вниз раз в 10 секунд из правого-верхнего угла.
 * - Ничего не блокирует (pointer-events: none).
 */
export default function StarSky() {
  // Фиксированный "рандом", чтобы картина была стабильна между перезагрузками
  const stars = useMemo(() => {
    const res: { x: number; y: number; s: number; tw: boolean }[] = [];
    let seed = 42;
    const rnd = () => {
      // простой LCG
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const COUNT = 120;
    for (let i = 0; i < COUNT; i++) {
      const x = Math.round(rnd() * 1000) / 10; // в %
      const y = Math.round(rnd() * 1000) / 10; // в %
      const s = 1 + Math.round(rnd() * 2);     // 1..3 px
      const tw = i % 3 === 0;                  // ~33% будут "сиять"
      res.push({ x, y, s, tw });
    }
    return res;
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
    >
      {/* Статичные/сияющие звёзды */}
      {stars.map((st, i) => (
        <div
          key={i}
          className={st.tw ? "star star--twinkle" : "star"}
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
          }}
        />
      ))}

      {/* Падающая звезда: позиционируем в правом верхнем секторе
          и летим ВПРАВО-ВНИЗ (направление 25-35deg) */}
      <div className="shooting-anchor">
        <div className="shooting-star" />
      </div>

      {/* Глобальные стили анимаций */}
      <style jsx global>{`
        .star {
          position: absolute;
          background: #fff;
          border-radius: 999px;
          opacity: 0.85;
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.9))
                  drop-shadow(0 0 6px rgba(255,255,255,0.35));
        }
        .star--twinkle {
          animation: starTwinkle 3.6s ease-in-out infinite;
          animation-delay: calc(var(--twinkle-shift, 0s));
        }
        /* Мягкое "дыхание" яркости без резких скачков */
        @keyframes
