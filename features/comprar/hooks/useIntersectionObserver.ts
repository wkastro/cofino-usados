"use client";

import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useIntersectionObserver(
  onIntersect: () => void,
  enabled: boolean,
  options: UseIntersectionObserverOptions = {},
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { threshold = 0, rootMargin = "200px" } = options;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onIntersect, enabled, threshold, rootMargin]);

  return sentinelRef;
}
