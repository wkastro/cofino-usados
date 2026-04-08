"use client";

import type React from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function VehicleError({ error, reset }: ErrorProps): React.ReactElement {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-fs-xl font-semibold font-clash-display tracking-tight">
        No pudimos cargar el vehículo
      </h2>
      <p className="text-muted-foreground max-w-md">
        Ocurrió un error al cargar la información del vehículo. Por favor, intenta de nuevo.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="bg-btn-black"
        >
          Intentar de nuevo
        </button>
        <Link href="/" className="bg-btn-lime">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
