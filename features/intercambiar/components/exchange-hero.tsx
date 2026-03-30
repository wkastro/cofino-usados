import Image from "next/image";

export function ExchangeHero() {
  return (
    <div className="flex flex-col lg:relative lg:min-h-150">
      {/* Text content */}
      <div className="px-6 lg:px-0">
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

      {/* Car image */}
      <div className="relative h-56 -mx-6 mt-4 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-0 lg:left-[calc(-40vw+50%)] lg:h-[80%] lg:mx-0 lg:mt-0 pointer-events-none">
        <Image
          src="/comparar_vehiculo.png"
          alt="Vehículo para intercambio"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-center lg:object-left"
          priority
        />
      </div>
    </div>
  );
}
