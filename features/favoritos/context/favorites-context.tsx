"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  toggleFavorite as toggleFavoriteAction,
  getFavoriteStatus,
} from "@/app/actions/favorito";

interface FavoritesContextValue {
  isFavorite: (vehiculoId: string) => boolean;
  toggleFavorite: (vehiculoId: string) => void;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  isFavorite: () => false,
  toggleFavorite: () => {},
  favoriteCount: 0,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    getFavoriteStatus()
      .then(({ ids, isAuthenticated: authed }) => {
        setFavoriteIds(ids);
        setIsAuthenticated(authed);
      })
      .catch(() => {
        setFavoriteIds([]);
        setIsAuthenticated(false);
      });
  }, []);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (vehiculoId: string) => favoriteIdSet.has(vehiculoId),
    [favoriteIdSet],
  );

  const toggleFavorite = useCallback(
    async (vehiculoId: string) => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Prevent double-clicks on the same vehicle
      if (pendingRef.current.has(vehiculoId)) return;
      pendingRef.current.add(vehiculoId);

      // Optimistic update
      setFavoriteIds((prev) =>
        prev.includes(vehiculoId)
          ? prev.filter((id) => id !== vehiculoId)
          : [...prev, vehiculoId],
      );

      try {
        const result = await toggleFavoriteAction(vehiculoId);
        // Sync with server truth
        setFavoriteIds((prev) =>
          result.isFavorite
            ? prev.includes(vehiculoId) ? prev : [...prev, vehiculoId]
            : prev.filter((id) => id !== vehiculoId),
        );
      } catch {
        // Revert optimistic update
        setFavoriteIds((prev) =>
          prev.includes(vehiculoId)
            ? prev.filter((id) => id !== vehiculoId)
            : [...prev, vehiculoId],
        );
      } finally {
        pendingRef.current.delete(vehiculoId);
      }
    },
    [isAuthenticated, router],
  );

  return (
    <FavoritesContext.Provider
      value={{
        isFavorite,
        toggleFavorite,
        favoriteCount: favoriteIds.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  return useContext(FavoritesContext);
}
