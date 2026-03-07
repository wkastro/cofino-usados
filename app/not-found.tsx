import Link from "next/link";
import { Container } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex items-center overflow-hidden py-16 sm:py-24 lg:min-h-[calc(100dvh-5rem)]">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-lime/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-brand-lime/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          {/* 404 number */}
          <div className="relative inline-block">
            <span className="text-[10rem] leading-none font-black tracking-tighter text-brand-lime sm:text-[14rem]">
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center font-bold text-foreground display-xxxl">
              Oops!
            </span>
          </div>

          {/* Copy */}
          <div className="space-y-3">
            <h1 className="font-bold text-foreground text-fluid-xl">
              Esta ruta no lleva a ningún lado
            </h1>
            <p className="mx-auto max-w-md text-fluid-base text-muted-foreground">
              Parece que tomaste un desvío. La página que buscas no existe o fue
              movida a otra dirección.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button variant="dark" size="lg" className="px-8" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <Link href="/comprar">Explorar autos</Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
