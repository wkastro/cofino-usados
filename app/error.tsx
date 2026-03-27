"use client";

import type React from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps): React.ReactElement {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-fs-xl font-semibold font-clash-display tracking-tight">
        Algo salió mal
      </h2>
      <p className="text-muted-foreground max-w-md">
        Ocurrió un error inesperado. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="bg-btn-black mt-2"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
