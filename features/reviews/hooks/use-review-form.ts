import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertReview } from "@/features/reviews/actions/reviews.actions";
import type { UserVehicleReview } from "@/features/reviews/types/review.types";

interface UseReviewFormParams {
  vehiculoId: string;
  vehiculoSlug: string;
  initialReview: UserVehicleReview | null;
}

interface FieldErrors {
  rating: string;
  comment: string;
}

const EMPTY_ERRORS: FieldErrors = { rating: "", comment: "" };

export function useReviewForm({
  vehiculoId,
  vehiculoSlug,
  initialReview,
}: UseReviewFormParams) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);

  const actionLabel = initialReview ? "Actualizar reseña" : "Publicar reseña";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors(EMPTY_ERRORS);

    startTransition(async () => {
      const result = await upsertReview({
        vehiculoId,
        vehiculoSlug,
        rating,
        comment,
      });

      if (!result.ok) {
        setMessage(result.message);
        setFieldErrors({
          rating: result.fieldErrors?.rating?.[0] ?? "",
          comment: result.fieldErrors?.comment?.[0] ?? "",
        });
        return;
      }

      setMessage(result.message);
      router.refresh();
    });
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    message,
    ratingError: fieldErrors.rating,
    commentError: fieldErrors.comment,
    actionLabel,
    isPending,
    handleSubmit,
  };
}
