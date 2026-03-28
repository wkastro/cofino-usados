"use client";

// rendering-hydration-suppress-warning: year may differ between server and client at midnight boundary
export function CurrentYear() {
  return (
    <span suppressHydrationWarning>
      {new Date().getFullYear()}{" "}
      <span className="font-bold text-white">Cofiño Usados</span>
    </span>
  );
}
