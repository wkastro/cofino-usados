import type React from "react";
import { notFound } from "next/navigation";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { VehicleGallery } from "@/features/vehicle-detail/components/vehicle-gallery";
import { VehicleInfo } from "@/features/vehicle-detail/components/vehicle-info";
import { VehicleSpecs } from "@/features/vehicle-detail/components/vehicle-specs";
import { LoanCalculator } from "@/features/vehicle-detail/components/loan-calculator";
import { ReviewsRoot } from "@/features/reviews/components/reviews-root";
import { getCachedVehicleReviewsSummary } from "@/features/reviews/data/reviews.cached";
import { getPageContent } from "@/app/actions/page-content.cached";
import { calculadoraBlock } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";
import type { CalculadoraContent } from "@/features/cms/blocks/detalle-vehiculo/calculadora.block";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

// rendering-hoist-jsx: static data hoisted to module level
const FALLBACK_IMAGES: VehicleImage[] = [
  { id: "img-001", url: "/single/cover_single_vehicle1.jpg", orden: 0 },
  { id: "img-002", url: "/single/cover_single_vehicle2.jpg", orden: 1 },
  { id: "img-003", url: "/single/cover_single_vehicle3.jpg", orden: 2 },
];

interface VehicleDetailProps {
  params: Promise<{ slug: string }>;
}

export async function VehicleDetail({ params }: VehicleDetailProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const [vehicle, content] = await Promise.all([
    getCachedVehicleBySlug(slug),
    getPageContent("detalle-vehiculo"),
  ]);
  if (!vehicle) notFound();

  const calculadora = (content[calculadoraBlock.key] ?? calculadoraBlock.defaultValue) as unknown as CalculadoraContent;
  const reviewsSummary = await getCachedVehicleReviewsSummary(vehicle.id);

  return (
    <>
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <VehicleGallery
          images={vehicle.galeria.length > 0 ? vehicle.galeria : FALLBACK_IMAGES}
          vehicleName={vehicle.nombre}
        />
        <VehicleInfo
          vehiculoId={vehicle.id}
          nombre={vehicle.nombre}
          slug={vehicle.slug}
          precio={vehicle.precio}
          preciodescuento={vehicle.preciodescuento}
          descripcion={vehicle.descripcion}
          averageRating={reviewsSummary.averageRating}
          totalReviews={reviewsSummary.totalReviews}
          calculadoraTitulo={calculadora.titulo}
          calculadoraDescripcion={calculadora.descripcion}
          calculadoraBancos={calculadora.bancos}
          calculadoraCuotas={calculadora.cuotas}
        />
      </div>

      {/* Specs + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-10 lg:mt-14">
        <VehicleSpecs
          transmision={vehicle.transmision}
          combustible={vehicle.combustible}
          kilometraje={vehicle.kilometraje}
          motor={vehicle.motor}
          anio={vehicle.anio}
          traccion={vehicle.traccion}
          sucursalNombre={vehicle.sucursal.nombre}
        />
        <LoanCalculator
          vehiclePrice={vehicle.preciodescuento ?? vehicle.precio}
          titulo={calculadora.titulo}
          descripcion={calculadora.descripcion}
          bancos={calculadora.bancos}
          cuotas={calculadora.cuotas}
        />
      </div>

      <ReviewsRoot vehiculoId={vehicle.id} vehiculoSlug={vehicle.slug} />
    </>
  );
}
