import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { VideoShowcase } from "@/features/vehicle-detail/components/video-showcase";
import { VehicleDetail } from "./vehicle-detail";

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  return (
    <Container className="py-6 lg:py-10">
      {/* Back link — static shell */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-fs-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>

      {/* Dynamic vehicle data — streams in */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
            <div className="aspect-4/3 w-full rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-10 w-1/3 rounded bg-muted" />
            </div>
          </div>
        }
      >
        <VehicleDetail params={params} />
      </Suspense>

      {/* Video showcase — static */}
      <div className="mt-10 lg:mt-14">
        <VideoShowcase
          videoUrl="https://www.youtube.com/watch?v=3ks4cK3lKjE"
          coverImage="/mechanic_video_cover.jpg"
          title="¿Porqué comprar con Cofiño Stahl?"
          subtitle="Aprovechá descuentos exclusivos, financiamiento flexible y garantía certificada."
        />
      </div>
    </Container>
  );
}
