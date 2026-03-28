import { notFound } from "next/navigation";
import { getCachedVehicleBySlug } from "@/app/actions/vehiculo.cached";
import { PurchaseCheckout } from "@/features/comprar/components/purchase-checkout";

interface PurchaseContentProps {
  params: Promise<{ slug: string }>;
}

export async function PurchaseContent({ params }: PurchaseContentProps) {
  const { slug } = await params;
  const vehicle = await getCachedVehicleBySlug(slug);

  if (!vehicle) return notFound();

  return (
    <PurchaseCheckout
      vehicle={{
        nombre: vehicle.nombre,
        marca: vehicle.marca.nombre,
        sucursal: vehicle.sucursal.nombre,
        imagen: "/compra.jpg",
      }}
    />
  );
}
