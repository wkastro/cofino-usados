import { Container } from "@/components/layout/container";

export default function Hero() {
  return (
    <main className="relative w-full h-dvh min-h-[600px] overflow-hidden">
      <section aria-label="Hero principal" className="absolute inset-0 w-full h-full">
        {/* Container for video and fallback */}
        <div className="absolute inset-0 w-full h-full bg-black">
          {/* Fallback pattern / image could go here for slow connections */}
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            // Let's use string URL directly assuming poster is first frame. 
            // In absence of actual poster, leaving it without or using standard CSS.
            className="w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src="/video-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Overlay - adjusted for better readability across devices */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-t from-black/90 via-black/40 md:via-black/30 to-black/10 z-10" />

        {/* Content - improved spacing and layout for mobile */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 sm:pb-24 md:pb-32 pt-28">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-white mb-4 sm:mb-6 leading-[1.1] sm:leading-tight drop-shadow-sm">
                Tu nuevo auto con el respaldo que mereces
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-sm">
                Calidad seguridad y confianza <strong className="font-bold text-white">en cada kilómetro</strong>
              </p>
            </div>
          </Container>
        </div>
      </section>
    </main>
  );
}
