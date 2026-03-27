"use client";

import { createContext, useContext, useTransition, type ReactNode, type TransitionStartFunction } from "react";

interface FilterLoadingContextValue {
  isPending: boolean;
  startTransition: TransitionStartFunction;
}

const FilterLoadingContext = createContext<FilterLoadingContextValue>({
  isPending: false,
  startTransition: () => {},
});

export function FilterLoadingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <FilterLoadingContext.Provider value={{ isPending, startTransition }}>
      {children}
    </FilterLoadingContext.Provider>
  );
}

export function useFilterLoading() {
  return useContext(FilterLoadingContext);
}
