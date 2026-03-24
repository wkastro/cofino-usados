import { useState, useCallback } from "react";

interface GalleryImage {
  id: string;
  url: string;
  orden: number;
}

export function useGallery(images: GalleryImage[]) {
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
