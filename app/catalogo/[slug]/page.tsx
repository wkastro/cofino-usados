import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getVehicleBySlug } from "@/app/actions/vehiculo";
import { VehicleGallery } from "@/features/vehicle-detail/components/vehicle-gallery";
import { VehicleInfo } from "@/features/vehicle-detail/components/vehicle-info";
import { VehicleSpecs } from "@/features/vehicle-detail/components/vehicle-specs";
import { LoanCalculator } from "@/features/vehicle-detail/components/loan-calculator";
import { VideoShowcase } from "@/features/vehicle-detail/components/video-showcase";
import { VehicleImage } from "@/types/vehiculo/vehiculo";

interface VehiclePageProps {
  params: Promise<{ slug: string }>;
}
const fallbackImages: VehicleImage[] = [
  {
    id: "img-001",
    url: "/single/cover_single_vehicle1.jpg",
    orden: 1,
  },
  {
    id: "img-002",
    url: "/single/cover_single_vehicle2.jpg",
    orden: 1,
  },
  {
    id: "img-003",
    url: "/single/cover_single_vehicle3.jpg",
    orden: 1,
  },
];
export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <Container className="py-6 lg:py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-fs-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <VehicleGallery images={fallbackImages} vehicleName={vehicle.nombre} />
        <VehicleInfo vehicle={vehicle} />
      </div>

      {/* Specs + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-10 lg:mt-14">
        <VehicleSpecs vehicle={vehicle} />
        <LoanCalculator vehiclePrice={vehicle.preciosiniva} />
      </div>

      {/* Video showcase */}
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
