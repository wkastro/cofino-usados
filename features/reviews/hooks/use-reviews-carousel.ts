import { useMemo, useState } from "react";
import type { VehicleReview } from "@/features/reviews/types/review.types";
import { formatReviewDate, buildInitials } from "@/features/reviews/lib/format";

export interface ReviewSlide extends VehicleReview {
  initials: string;
  formattedDate: string;
}

export function useReviewsCarousel(reviews: VehicleReview[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo<ReviewSlide[]>(
    () =>
      reviews.map((review) => ({
        ...review,
        initials: buildInitials(review.user.fullName),
        formattedDate: formatReviewDate(review.createdAt),
      })),
    [reviews],
  );

  const canNavigate = slides.length > 1;

  const nextSlide = () => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    if (!canNavigate) return;
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return {
    slides,
    activeIndex,
    setActiveIndex,
    canNavigate,
    nextSlide,
    previousSlide,
  };
}
