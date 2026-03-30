import { prisma } from "@/lib/prisma";
import type {
  ReviewsSummary,
  UserVehicleReview,
  VehicleReview,
} from "@/features/reviews/types/review.types";

export async function getVehicleReviewsSummary(
  vehiculoId: string,
): Promise<ReviewsSummary> {
  const reviews = await prisma.review.findMany({
    where: { vehiculoId },
    select: {
      id: true,
      userId: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mappedReviews: VehicleReview[] = reviews.map((review) => ({
    ...review,
    comment: review.comment.trim(),
  }));

  const totalReviews = mappedReviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : Number(
          (
            mappedReviews.reduce((total, review) => total + review.rating, 0) /
            totalReviews
          ).toFixed(1),
        );

  return {
    reviews: mappedReviews,
    averageRating,
    totalReviews,
  };
}

export async function getUserVehicleReview(
  userId: string,
  vehiculoId: string,
): Promise<UserVehicleReview | null> {
  const review = await prisma.review.findUnique({
    where: {
      userId_vehiculoId: {
        userId,
        vehiculoId,
      },
    },
    select: {
      id: true,
      rating: true,
      comment: true,
    },
  });

  if (!review) return null;

  return {
    ...review,
    comment: review.comment.trim(),
  };
}
