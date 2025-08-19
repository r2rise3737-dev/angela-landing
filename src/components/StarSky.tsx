"use client";

/**
 * Звёздное небо + мягкое мерцание + падающая звезда.
 * Использование:
 * <StarSky className="absolute inset-0 pointer-events-none" />
 */
export default function StarSky({ className = "" }: { className?: string }) {
  return (
    <div className={`ap-star-sky ${className}`}>
      {/* Базовые звёзды (плотный слой, без броского мерцания) */}
      <div className="ap-stars base" />
      {/* Яркие звёзды (~30%), мягко «дышат» */}
      <div className="ap-stars bright" />
      {/* Падающая звезда: заменяет статичную — летит справа-вниз 1 раз в 10с */}
      <div className="ap-shooting" aria-hidden="true">
        <span className="ap-tail" />
        <span className="ap-head" />
      </div>

      {/* Мягкая маска-переход к бежевому фону внизу (убирает «линию» раздела) */}
      <div className="ap-fade" />

      <style jsx global>{`
        .ap-star-sky {
          position: relative;
          overflow: hidden;
        }

        /* Слои звёзд делаем через radial-gradient, чтобы не плодить тысячи DOM-элементов */
        .ap-stars {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
          pointer-events: none;
        }

        /* Базовый «пыльный» слой: очень мелкие точки, слабая яркость */
        .ap-stars.base {
          background-image:
            radial-gradient(circle at center, rgba(255,255,255,0.7) 1px, transparent 1.6px);
          background-size: 3px 3px;
          opacity: 0.6;
          filter: blur(0.2px);
        }

        /* Яркие звёзды (~реже и крупнее), с мягким дыханием яркости */
        .ap-stars.bright {
          /* реже: увеличим шаг сетки */
          background-image:
            radial-gradient(circle at center, rgba(255,255,255,0.95) 1.4px, transparent 2.4px);
          background-size: 6px 6px;
          opacity: 0.9;
          animation: ap-twinkle 6.5s ease-in-out 0s infinite alternate;
          /* лёгкая «зернистость», чтобы мерцание не выглядело мигалкой */
          filter: drop-shadow(0 0 1px rgba(255,255,255,0.6));
          mix-blend-mode: screen;
        }

        /* Падающая звезда */
        .ap-shooting {
          position: absolute;
          /* Старт в правом-верхнем секторе — там, где на исходной картинке была статичная «падающая» */
          top: 10%;
          left: 72%;
          width: 1px;
          height: 1px;
          pointer-events: none;
          transform: translate3d(0,0,0);
          /* 1 раз в 10 секунд, бесшовный цикл */
          animation: ap-shoot 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }
        .ap-shooting .ap-tail {
          position: absolute;
          width: 220px; /* длина хвоста */
          height: 2px;
          right: 0;
          top: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.9) 60%, #fff 100%);
          border-radius: 2px;
          transform-origin: right center;
          /* наклон по диагонали вправо-вниз */
          transform: rotate(25deg);
          filter: blur(0.4px);
        }
        .ap-shooting .ap-head {
          position: absolute;
          right: -2px;
          top: -2px;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #fff 0%, rgba(255,255,255,0.2) 70%, transparent 100%);
          border-radius: 50%;
          transform: rotate(25deg);
          box-shadow:
            0 0 6px rgba(255,255,255,0.9),
            0 0 12px rgba(255,255,255,0.8);
        }

        /* Фоновая нижняя вуаль: делает мягче стык с бежевым фоном страницы */
        .ap-fade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(248,245,239,0) 0%,
            rgba(248,245,239,0.35) 55%,
            rgba(248,245,239,0.75) 78%,
            #f8f5ef 100%
          );
        }

        /* Мерцание ярких звёзд — тонкое «дыхание» */
        @keyframes ap-twinkle {
          0%   { opacity: 0.75; filter: drop-shadow(0 0 0.5px rgba(255,255,255,0.5)); }
          45%  { opacity: 1.00; filter: drop-shadow(0 0 1.2px rgba(255,255,255,0.9)); }
          100% { opacity: 0.82; filter: drop-shadow(0 0 0.8px rgba(255,255,255,0.7)); }
        }

        /* Траектория падающей звезды: вправо-вниз, затухает к концу */
        /* Длительность прописана в .ap-shooting (10s) */
        @keyframes ap-shoot {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          20% {
            transform: translate3d(26vw, 16vh, 0); /* пролёт по диагонали вправо-вниз */
            opacity: 0.85;
          }
          30% {
            transform: translate3d(36vw, 22vh, 0);
            opacity: 0.0; /* хвост растворился */
          }
          100% {
            transform: translate3d(36vw, 22vh, 0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
