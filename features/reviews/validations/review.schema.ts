import { z } from "zod";

export const reviewSchema = z.object({
  vehiculoId: z.string().min(1, "Vehículo inválido"),
  vehiculoSlug: z.string().min(1, "Slug de vehículo inválido"),
  rating: z
    .number({ error: "La calificación es obligatoria" })
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
  comment: z
    .string()
    .trim()
    .min(1, "El comentario es obligatorio")
    .max(1000, "El comentario no puede superar 1000 caracteres"),
});

export type UpsertReviewInput = z.infer<typeof reviewSchema>;
