import Image from "next/image";
import { Container } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TestDrivePage() {
  return (
    <main className="py-4">
      <Container>
        {/* Main layout: stacked on mobile, side by side on lg+ */}
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
              <h2 className="font-bold leading-tight text-white display-xxl">
                ¡Conoce tu futuro auto
                <br />
                antes de comprarlo!
              </h2>
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex flex-col justify-center py-4 lg:py-12">
            <div className="mx-auto w-full max-w-md space-y-6">
              {/* Title */}
              <div className="space-y-1 text-center">
                <h1 className="font-bold text-foreground text-fluid-xl">
                  Agenda aquí tu cita
                </h1>
                <p className="text-fluid-base text-muted-foreground">
                  Vive la experiencia de conocer y manejar el auto que desees.
                </p>
              </div>

              {/* Step tabs */}
              <div className="flex items-center justify-center gap-3">
                <Button variant="lime" size="lg" className="px-5">
                  Información de contacto
                </Button>
                <Button variant="dark" size="lg" className="px-5">
                  Tipo de test drive
                </Button>
              </div>

              {/* Form fields */}
              <div className="space-y-5">
                {/* Nombre completo */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre completo<span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" placeholder="Juan Roberto" />
                </div>

                {/* Correo electrónico */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo electrónico
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan.roberto@example.com"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Teléfono<span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="+502">
                      <SelectTrigger className="w-30 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+502">🇬🇹 +502</SelectItem>
                        <SelectItem value="+503">🇸🇻 +503</SelectItem>
                        <SelectItem value="+504">🇭🇳 +504</SelectItem>
                        <SelectItem value="+52">🇲🇽 +52</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="phone" type="tel" placeholder="5987 - 2409" />
                  </div>
                </div>

                {/* Método de contacto */}
                <div className="space-y-2">
                  <Label htmlFor="contact-method">
                    ¿Cómo desea que le contactemos?
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="llamada">
                        Llamada telefónica
                      </SelectItem>
                      <SelectItem value="correo">Correo electrónico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit button */}
                <Button variant="dark" size="lg" className="w-full">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
