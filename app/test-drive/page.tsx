import dynamic from "next/dynamic";
import Image from "next/image";
import { Container } from "@/components/layout/container";

const FormTestDrive = dynamic(() => import("@/features/test-drive/form"), {
  loading: () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-muted" />
        ))}
      </div>
      <div className="h-12 w-full rounded-full bg-muted" />
    </div>
  ),
});

export default function TestDrivePage() {
  return (
    <main className="py-4">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Hero image */}
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl sm:aspect-3/4 lg:aspect-auto lg:min-h-150">
            <Image
              src="/test-drive.jpg"
              alt="Persona sonriendo al volante de un auto"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            {/* Texto sobre la imagen */}
            <div className="absolute bottom-8 left-6 right-6">
              <p className="font-semibold leading-tight text-white text-display-2 font-display">
                ¡Conoce tu futuro auto
                <br />
                antes de comprarlo!
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex flex-col justify-center py-4 lg:py-12">
            <FormTestDrive />
          </div>
        </div>
      </Container>
    </main>
  );
}
