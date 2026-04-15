"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGallery } from "../hooks/useGallery";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

// rendering-hoist-jsx: static fallback data hoisted outside component
const DEFAULT_IMAGES: VehicleImage[] = [
  { id: "1", url: "/single/cover_single_vehicle1.jpg", orden: 0 },
  { id: "2", url: "/single/cover_single_vehicle2.jpg", orden: 1 },
  { id: "3", url: "/single/cover_single_vehicle3.jpg", orden: 2 },
];

interface VehicleGalleryProps {
  images: VehicleImage[];
  vehicleName: string;
}

const FALLBACK_URL = "/single/cover_single_vehicle1.jpg";

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const galleryImages = images.length > 0 ? images : DEFAULT_IMAGES;
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());

  const { selectedImage, selectedIndex, selectImage } =
    useGallery(galleryImages);

  function handleError(id: string) {
    setErrorIds((prev) => new Set(prev).add(id));
  }

  function resolveUrl(image: VehicleImage) {
    return errorIds.has(image.id) ? FALLBACK_URL : image.url;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={resolveUrl(selectedImage)}
          alt={vehicleName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          onError={() => handleError(selectedImage.id)}
        />
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => selectImage(index)}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-xl transition-all",
                selectedIndex === index
                  ? "ring-[3px] ring-brand-lime ring-offset-2"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={resolveUrl(image)}
                alt={`${vehicleName} - imagen ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover"
                onError={() => handleError(image.id)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
