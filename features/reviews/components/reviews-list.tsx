"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRating } from "@/features/reviews/components/star-rating";
import { useReviewsCarousel } from "@/features/reviews/hooks/use-reviews-carousel";
import type { VehicleReview } from "@/features/reviews/types/review.types";
import type { ReviewSlide } from "@/features/reviews/hooks/use-reviews-carousel";

interface ReviewsListProps {
  reviews: VehicleReview[];
  averageRating: number;
  totalReviews: number;
  currentUserId?: string;
}

function ReviewsHeader({
  totalReviews,
  averageRating,
}: {
  totalReviews: number;
  averageRating: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <h3 className="text-fs-lg font-semibold text-foreground">Reseñas</h3>
      <span className="inline-flex min-w-11 items-center justify-center rounded-md bg-brand-dark px-3 py-1.5 text-sm font-semibold text-brand-dark-foreground">
        {totalReviews}
      </span>
      <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {averageRating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5">
          <StarRating rating={Math.round(averageRating)} size="sm" />
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  isOwnReview,
}: {
  review: ReviewSlide;
  isOwnReview: boolean;
}) {
  return (
    <article className="w-full shrink-0 space-y-5 rounded-2xl p-1">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-slate-600 text-fs-base font-semibold text-white">
            {review.initials}
          </div>
          <div>
            <p className="text-fs-md font-semibold text-foreground leading-tight">
              {review.user.fullName}
              {isOwnReview ? " (Tu reseña)" : ""}
            </p>
            <p className="text-sm text-muted-foreground">Comprador</p>
          </div>
        </div>

        <div className="space-y-2 md:text-right">
          <p className="text-sm text-muted-foreground">
            {review.formattedDate}
          </p>
          <div className="flex items-center gap-1 md:justify-end">
            <StarRating
              rating={review.rating}
              inactiveColor="fill-transparent text-slate-400"
            />
          </div>
        </div>
      </div>

      <p className="max-w-6xl text-fs-base text-muted-foreground leading-relaxed">
        {review.comment}
      </p>
    </article>
  );
}

function CarouselNavigation({
  slides,
  activeIndex,
  onSelect,
  onPrevious,
  onNext,
}: {
  slides: ReviewSlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Reseña anterior"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Siguiente reseña"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        {slides.map((review, index) => (
          <button
            key={`dot-${review.id}`}
            type="button"
            aria-label={`Ir a reseña ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              "h-2.5 rounded-full transition-all",
              index === activeIndex
                ? "w-6 bg-brand-dark"
                : "w-2.5 bg-slate-300 hover:bg-slate-400",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  currentUserId,
}: ReviewsListProps) {
  const {
    slides,
    activeIndex,
    setActiveIndex,
    canNavigate,
    nextSlide,
    previousSlide,
  } = useReviewsCarousel(reviews);

  return (
    <section className="space-y-2 rounded-2xl bg-white p-4">
      <ReviewsHeader totalReviews={totalReviews} averageRating={averageRating} />

      {slides.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aún no hay reseñas para este vehículo. Sé el primero en compartir tu
          experiencia.
        </p>
      ) : (
        <>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwnReview={currentUserId === review.userId}
                />
              ))}
            </div>
          </div>

          {canNavigate ? (
            <CarouselNavigation
              slides={slides}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
              onPrevious={previousSlide}
              onNext={nextSlide}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
