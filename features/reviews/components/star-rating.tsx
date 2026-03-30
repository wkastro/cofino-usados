import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  inactiveColor?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export function StarRating({
  rating,
  size = "md",
  inactiveColor = "fill-transparent text-amber-400",
}: StarRatingProps) {
  return (
    <>
      {STAR_VALUES.map((value) => (
        <Star
          key={value}
          className={cn(
            sizeClasses[size],
            value <= rating
              ? "fill-amber-400 text-amber-400"
              : inactiveColor,
          )}
        />
      ))}
    </>
  );
}

interface StarRatingInputProps {
  rating: number;
  onRate: (value: number) => void;
}

export function StarRatingInput({ rating, onRate }: StarRatingInputProps) {
  return (
    <>
      {STAR_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          aria-label={`Calificar con ${value} estrellas`}
          onClick={() => onRate(value)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "size-6",
              value <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-amber-400",
            )}
          />
        </button>
      ))}
    </>
  );
}
