import { auth } from "@/auth";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { ReviewsList } from "@/features/reviews/components/reviews-list";
import {
  getUserVehicleReview,
  getVehicleReviewsSummary,
} from "@/features/reviews/data/reviews.queries";

interface ReviewsRootProps {
  vehiculoId: string;
  vehiculoSlug: string;
}

export async function ReviewsRoot({
  vehiculoId,
  vehiculoSlug,
}: ReviewsRootProps) {
  const [session, summary] = await Promise.all([
    auth(),
    getVehicleReviewsSummary(vehiculoId),
  ]);
  const sessionUserId = session?.user?.id ?? null;

  const canReview = Boolean(sessionUserId) && session?.user?.role === "USER";

  const userReview =
    canReview && sessionUserId
      ? await getUserVehicleReview(sessionUserId, vehiculoId)
      : null;

  return (
    <section className="mt-10 space-y-6 lg:mt-14">
      <ReviewsList
        reviews={summary.reviews}
        averageRating={summary.averageRating}
        totalReviews={summary.totalReviews}
        currentUserId={sessionUserId ?? undefined}
      />

      <ReviewForm
        vehiculoId={vehiculoId}
        vehiculoSlug={vehiculoSlug}
        canReview={canReview}
        initialReview={userReview}
      />
    </section>
  );
}
