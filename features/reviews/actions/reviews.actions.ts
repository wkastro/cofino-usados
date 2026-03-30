"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  reviewSchema,
  type UpsertReviewInput,
} from "@/features/reviews/validations/review.schema";

interface UpsertReviewResult {
  ok: boolean;
  message: string;
  fieldErrors?: {
    rating?: string[];
    comment?: string[];
    vehiculoId?: string[];
    vehiculoSlug?: string[];
  };
}

export async function upsertReview(
  input: UpsertReviewInput,
): Promise<UpsertReviewResult> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "USER") {
    return {
      ok: false,
      message: "Debes iniciar sesión con una cuenta de usuario para reseñar.",
    };
  }

  const validated = reviewSchema.safeParse(input);

  if (!validated.success) {
    return {
      ok: false,
      message: "Hay errores en el formulario.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;

  const vehicle = await prisma.vehiculo.findUnique({
    where: { id: data.vehiculoId },
    select: { id: true, slug: true },
  });

  if (!vehicle) {
    return {
      ok: false,
      message: "El vehículo no existe.",
    };
  }

  await prisma.review.upsert({
    where: {
      userId_vehiculoId: {
        userId: session.user.id,
        vehiculoId: data.vehiculoId,
      },
    },
    create: {
      userId: session.user.id,
      vehiculoId: data.vehiculoId,
      rating: data.rating,
      comment: data.comment,
    },
    update: {
      rating: data.rating,
      comment: data.comment,
    },
  });

  revalidatePath(`/catalogo/${vehicle.slug}`);

  if (data.vehiculoSlug !== vehicle.slug) {
    revalidatePath(`/catalogo/${data.vehiculoSlug}`);
  }

  return {
    ok: true,
    message: "Tu reseña se guardó correctamente.",
  };
}
