import { useState, useCallback } from "react";
import type { VehicleImage } from "@/types/vehiculo/vehiculo";

interface UseGalleryReturn {
  selectedImage: VehicleImage;
  selectedIndex: number;
  selectImage: (index: number) => void;
}

export function useGallery(images: VehicleImage[]): UseGalleryReturn {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] ?? images[0];

  const selectImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setSelectedIndex(index);
      }
    },
    [images.length],
  );

  return {
    selectedImage,
    selectedIndex,
    selectImage,
  };
}
