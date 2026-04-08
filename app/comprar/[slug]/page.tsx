import type React from "react";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PurchaseContent } from "@/features/comprar/components/purchase-content";
import { SimilarVehicles } from "@/features/recommendations/components/similar-vehicles";
import { VehicleCardSkeletonGrid } from "@/components/global/vehicle-card-skeleton";

interface BuyPageProps {
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

export default async function BuyPage({ params }: BuyPageProps): Promise<React.ReactElement> {
  return (
    <Container className="py-4">
      <Suspense
        fallback={
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 animate-pulse">
            <div className="space-y-6">
              <div className="h-12 w-full rounded-full bg-muted" />
              <div className="h-96 w-full rounded-2xl bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-muted" />
              <div className="h-6 w-1/2 rounded bg-muted" />
              <div className="h-6 w-3/4 rounded bg-muted" />
            </div>
          </div>
        }
      >
        <PurchaseContent params={params} />
      </Suspense>

      <Suspense fallback={<VehicleCardSkeletonGrid count={3} />}>
        <SimilarVehiclesSection params={params} />
      </Suspense>
    </Container>
  );
}
