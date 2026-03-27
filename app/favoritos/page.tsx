import { Suspense } from "react";
import { Heart } from "lucide-react";
import { FavoritesContent } from "./favorites-content";

export default function FavoritesPage() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-7 w-7 fill-destructive text-destructive" />
        <h1 className="text-2xl font-semibold">Mis Favoritos</h1>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full max-w-[24rem] h-[28rem] rounded-lg bg-card border border-border animate-pulse"
              />
            ))}
          </div>
        }
      >
        <FavoritesContent />
      </Suspense>
    </section>
  );
}
