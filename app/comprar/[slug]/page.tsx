import { notFound } from "next/navigation";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { Container } from "@/components/layout/container";
import { PurchaseCheckout } from "@/features/comprar/components/purchase-checkout";

export default async function BuyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getCachedVehicleBySlug(slug);

  if (!vehicle) return notFound();

  const firstImage = vehicle.galeria?.[0]?.url ?? "/compra.jpg";

  return (
    <Container className="py-8 lg:py-12">
      <PurchaseCheckout
        vehicle={{
          nombre: vehicle.nombre,
          marca: vehicle.marca.nombre,
          sucursal: vehicle.sucursal.nombre,
          imagen: firstImage,
        }}
      />
    </Container>
  );
}
