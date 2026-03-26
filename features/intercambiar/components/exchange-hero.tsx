import Image from "next/image";

export function ExchangeHero() {
  return (
    <div className="relative flex flex-col justify-start min-h-100 lg:min-h-150">
      {/* Text content */}
      <div className="relative z-10 px-6 lg:px-0">
        <p className="text-fs-md text-muted-foreground mb-2">Vender</p>
        <h1 className="font-semibold leading-tight">
          ¡Vender tu auto
          <br />
          nunca fue tan fácil!
        </h1>
        {/* Decorative underline */}
        <svg
          width="120"
          height="20"
          viewBox="0 0 120 20"
          fill="none"
          className="mt-1"
          aria-hidden="true"
        >
          <path
            d="M5 15 Q30 2 60 10 Q90 18 115 5"
            stroke="#C4F402"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Car image — breaks out to the left edge of the viewport */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 left-[calc(-40vw+50%)] h-[70%] lg:h-[80%] pointer-events-none">
        <Image
          src="/comparar_vehiculo.png"
          alt="Vehículo para intercambio"
          fill
          sizes="50vw"
          className="object-contain object-left"
          priority
        />
      </div>
    </div>
  );
}
