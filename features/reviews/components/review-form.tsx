"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/features/reviews/components/star-rating";
import { useReviewForm } from "@/features/reviews/hooks/use-review-form";
import type { UserVehicleReview } from "@/features/reviews/types/review.types";

interface ReviewFormProps {
  vehiculoId: string;
  vehiculoSlug: string;
  canReview: boolean;
  initialReview: UserVehicleReview | null;
}


export function ReviewForm({
  vehiculoId,
  vehiculoSlug,
  canReview,
  initialReview,
}: ReviewFormProps) {
  const {
    rating,
    setRating,
    comment,
    setComment,
    message,
    ratingError,
    commentError,
    actionLabel,
    isPending,
    handleSubmit,
  } = useReviewForm({
    vehiculoId,
    vehiculoSlug,
    initialReview,
  });

  if (!canReview) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
        <h3 className="text-lg font-semibold text-foreground">Deja tu reseña</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Para reseñar este vehículo necesitas iniciar sesión como usuario.
        </p>
        <Button asChild className="mt-4" variant="dark">
          <Link href="/login" className="bg-btn-black">Iniciar sesión</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6"
    >
      <h3 className="text-lg font-semibold text-foreground">Deja tu reseña</h3>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Calificación (1 a 5)</p>
        <div className="flex items-center gap-1">
          <StarRatingInput rating={rating} onRate={setRating} />
        </div>
        {ratingError ? <p className="text-xs text-red-500">{ratingError}</p> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-sm text-muted-foreground">
          Comentario
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-foreground bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors focus-visible:border-transparent focus-visible:ring-[3px] focus-visible:ring-ring/50"
          placeholder="Cuéntanos tu experiencia con este vehículo"
          maxLength={1000}
        />
        {commentError ? <p className="text-xs text-red-500">{commentError}</p> : null}
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <Button type="submit" variant="dark" disabled={isPending}>
        {isPending ? "Guardando..." : actionLabel}
      </Button>
    </form>
  );
}
