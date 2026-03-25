"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGallery } from "../hooks/useGallery";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

interface VehicleGalleryProps {
  images: VehicleImage[];
  vehicleName: string;
}

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const fallbackImages: VehicleImage[] =
    images.length > 0
      ? images
      : [
          { id: "1", url: "/single/cover_single_vehicle1.jpg", orden: 0 },
          { id: "2", url: "/single/cover_single_vehicle2.jpg", orden: 1 },
          { id: "3", url: "/single/cover_single_vehicle3.jpg", orden: 2 },
        ];

  const { selectedImage, selectedIndex, selectImage } =
    useGallery(fallbackImages);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={selectedImage.url}
          alt={vehicleName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {fallbackImages.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {fallbackImages.map((image, index) => (
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
                src={image.url}
                alt={`${vehicleName} - imagen ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
