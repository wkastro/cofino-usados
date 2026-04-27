import type React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { VideoShowcase } from "@/features/vehicle-detail/components/video-showcase";
import { VehicleDetail } from "@/features/vehicle-detail/components/vehicle-detail";
import { SimilarVehicles } from "@/features/recommendations/components/similar-vehicles";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";
import { getPageContent } from "@/app/actions/page-content.cached";
import { videoShowcaseBlock } from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block";
import type { VideoShowcaseContent } from "@/features/cms/blocks/detalle-vehiculo/video-showcase.block";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { formatCurrency, formatKilometers } from "@/lib/formatters/vehicle";

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getCachedVehicleBySlug(slug);

  if (!vehicle) return { title: "Vehículo no encontrado", robots: { index: false } };

  const price = vehicle.preciodescuento ?? vehicle.precio;
  const description = `${vehicle.nombre} ${vehicle.anio} · ${vehicle.transmision} · ${vehicle.combustible} · ${formatKilometers(vehicle.kilometraje)} · ${formatCurrency(price)}`;
  const image = vehicle.galeria[0]?.url;
  const url = `/comprar/${slug}`;

  return {
    title: `${vehicle.nombre} ${vehicle.anio}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${vehicle.nombre} ${vehicle.anio} | Cofiño Usados`,
      description,
      url,
      images: image ? [{ url: image, alt: vehicle.nombre }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${vehicle.nombre} ${vehicle.anio} | Cofiño Usados`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

async function VideoShowcaseSection(): Promise<React.ReactElement> {
  const content = await getPageContent("detalle-vehiculo");
  const videoContent = (content[videoShowcaseBlock.key] ?? videoShowcaseBlock.defaultValue) as unknown as VideoShowcaseContent;
  const videoUrl = videoContent.videoArchivoUrl || videoContent.videoUrl || videoShowcaseBlock.defaultValue.videoUrl;

  return (
    <VideoShowcase
      videoUrl={videoUrl}
      coverImage={videoContent.coverImage || videoShowcaseBlock.defaultValue.coverImage}
      title={videoContent.titulo || videoShowcaseBlock.defaultValue.titulo}
      subtitle={videoContent.subtitulo || videoShowcaseBlock.defaultValue.subtitulo}
    />
  );
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
  return (
    <Container className="py-6 lg:py-10">
      <Link
        href="/comprar"
        className="inline-flex items-center gap-1 text-fs-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>

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

      <div className="mt-10 lg:mt-14">
        <VideoShowcaseSection />
      </div>

      <Suspense fallback={<VehicleCardSkeletonGrid count={3} />}>
        <SimilarVehiclesSection params={params} />
      </Suspense>
    </Container>
  );
}
