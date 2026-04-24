import type React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { VideoShowcase } from "@/features/vehicle-detail/components/video-showcase";
import { VehicleDetail } from "@/features/vehicle-detail/components/vehicle-detail";
import { SimilarVehicles } from "@/features/recommendations/components/similar-vehicles";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { getPageContent } from "@/app/actions/page-content.cached";
import { videoShowcaseBlock } from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block";
import { calculadoraBlock } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";
import type { VideoShowcaseContent } from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block";
import type { CalculadoraContent } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

async function SimilarVehiclesSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement | null> {
  const { slug } = await params;
  return <SimilarVehicles slug={slug} />;
}

export default async function VehiclePage({ params }: VehiclePageProps): Promise<React.ReactElement> {
  const content = await getPageContent("detalle-vehiculo");

  const videoContent     = (content[videoShowcaseBlock.key] ?? videoShowcaseBlock.defaultValue) as unknown as VideoShowcaseContent;
  const calculadoraContent = (content[calculadoraBlock.key] ?? calculadoraBlock.defaultValue) as unknown as CalculadoraContent;

  const videoUrl = videoContent.videoArchivoUrl || videoContent.videoUrl || videoShowcaseBlock.defaultValue.videoUrl;

  return (
    <Container className="py-6 lg:py-10">
      {/* Back link — static shell */}
      <Link
        href="/comprar"
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
        <VehicleDetail params={params} calculadora={calculadoraContent} />
      </Suspense>

      {/* Video showcase — from CMS */}
      <div className="mt-10 lg:mt-14">
        <VideoShowcase
          videoUrl={videoUrl}
          coverImage={videoContent.coverImage || videoShowcaseBlock.defaultValue.coverImage}
          title={videoContent.titulo || videoShowcaseBlock.defaultValue.titulo}
          subtitle={videoContent.subtitulo || videoShowcaseBlock.defaultValue.subtitulo}
        />
      </div>

      {/* Similar vehicles — streams in */}
      <Suspense fallback={<VehicleCardSkeletonGrid count={3} />}>
        <SimilarVehiclesSection params={params} />
      </Suspense>
    </Container>
  );
}
