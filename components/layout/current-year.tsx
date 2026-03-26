"use client";

export function CurrentYear() {
  return (
    <span>
      {new Date().getFullYear()}{" "}
      <span className="font-bold text-white">Cofiño Usados</span>
    </span>
  );
}
