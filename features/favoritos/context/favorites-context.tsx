"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
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
  const [, startTransition] = useTransition();
  const [baseIds, setBaseIds] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [optimisticIds, updateOptimisticIds] = useOptimistic(
    baseIds,
    (current: string[], vehiculoId: string) =>
      current.includes(vehiculoId)
        ? current.filter((id) => id !== vehiculoId)
        : [...current, vehiculoId],
  );

  useEffect(() => {
    getFavoriteStatus().then(({ ids, isAuthenticated: authed }) => {
      setBaseIds(ids);
      setIsAuthenticated(authed);
    });
  }, []);

  const isFavorite = useCallback(
    (vehiculoId: string) => optimisticIds.includes(vehiculoId),
    [optimisticIds],
  );

  const toggleFavorite = useCallback(
    (vehiculoId: string) => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      startTransition(async () => {
        updateOptimisticIds(vehiculoId);
        const result = await toggleFavoriteAction(vehiculoId);
        setBaseIds((prev) =>
          result.isFavorite
            ? [...prev, vehiculoId]
            : prev.filter((id) => id !== vehiculoId),
        );
      });
    },
    [isAuthenticated, router, startTransition, updateOptimisticIds],
  );

  return (
    <FavoritesContext.Provider
      value={{
        isFavorite,
        toggleFavorite,
        favoriteCount: optimisticIds.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  return useContext(FavoritesContext);
}
