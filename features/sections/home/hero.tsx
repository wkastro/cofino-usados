import { Container } from "@/components/layout/container";

export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <main className="relative w-full h-dvh min-h-150">
      {/* SVG clip-path: curva en esquina inferior izquierda, recto en inferior derecha */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {/* Desktop: corte más alto */}
          <clipPath id="hero-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 1 0 L 1 0.70 Q 0 1.2 0 0.50 Z" />
          </clipPath>
          {/* Mobile: corte recto (sin curva) */}
          <clipPath id="hero-clip-mobile" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 1 0 L 1 0.88 L 0 0.72 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Capa visual con clip-path */}
      <div className="absolute inset-0 overflow-hidden hero-visual-clip">
        <div className="absolute inset-0 w-full h-full bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/video-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 w-full h-full bg-linear-to-t from-black/95 via-black/60 md:via-black/50 to-black/50 z-10" />
      </div>

      {/* Texto */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-112 sm:pb-88 md:pb-72 lg:pb-64 pt-28">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-display-1 font-medium tracking-tight text-white mb-2 sm:mb-3 leading-[1.1] sm:leading-tight drop-shadow-sm">
              Tu nuevo auto con el respaldo que mereces
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-sm">
              Calidad seguridad y confianza <strong className="font-bold text-white">en cada kilómetro</strong>
            </p>
          </div>
        </Container>
      </div>

      {/* Children (filtros) fuera del clip-path, dentro del viewport */}
      {children}
    </main>
  );
}
