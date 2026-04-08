import { cacheLife, cacheTag } from "next/cache";
import { getVehicleReviewsSummary } from "./reviews.queries";
import type { ReviewsSummary } from "@/features/reviews/types/review.types";

export async function getCachedVehicleReviewsSummary(
  vehiculoId: string,
): Promise<ReviewsSummary> {
  "use cache";
  cacheLife("hours");
  cacheTag(`reviews-${vehiculoId}`);

  return getVehicleReviewsSummary(vehiculoId);
}
