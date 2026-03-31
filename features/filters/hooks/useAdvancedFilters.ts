import { useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFilterLoading } from "@/features/filters/context/filter-loading-context";
import type {
  PriceRange,
  RangeValues,
  UseAdvancedFiltersReturn,
} from "@/features/filters/types/advanced-filters";

const CURRENT_YEAR = new Date().getFullYear();

export function useAdvancedFilters(
  priceRange: PriceRange,
  minYear: number,
  kilometrajeRange: RangeValues = { min: 0, max: 500000 },
): UseAdvancedFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useFilterLoading();

  const [open, setOpen] = useState(false);
  const [etiqueta, setEtiqueta] = useState(
    searchParams.get("etiqueta") ?? "",
  );
  const [combustible, setCombustible] = useState(
    searchParams.get("combustible") ?? "",
  );
  const [precioMin, setPrecioMin] = useState(
    Number(searchParams.get("precio-min")) || priceRange.min,
  );
  const [precioMax, setPrecioMax] = useState(
    Number(searchParams.get("precio-max")) || priceRange.max,
  );
  const [anioMin, setAnioMin] = useState(
    Number(searchParams.get("anio")) || minYear,
  );
  const [kmin, setKmin] = useState(
    Number(searchParams.get("kmin")) || kilometrajeRange.min,
  );
  const [kmax, setKmax] = useState(
    Number(searchParams.get("kmax")) || kilometrajeRange.max,
  );

  const isPriceModified =
    precioMin !== priceRange.min || precioMax !== priceRange.max;

  const isYearModified = anioMin !== minYear;

  const isKilometrajeModified =
    kmin !== kilometrajeRange.min || kmax !== kilometrajeRange.max;

  const activeFilterCount =
    [etiqueta, combustible].filter(Boolean).length +
    (isPriceModified ? 1 : 0) +
    (isYearModified ? 1 : 0) +
    (isKilometrajeModified ? 1 : 0);

  const handleSliderChange = useCallback((values: number[]) => {
    setPrecioMin(values[0]);
    setPrecioMax(values[1]);
  }, []);

  const handleMinInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const value = raw ? Math.max(0, Number(raw)) : priceRange.min;
      setPrecioMin(Math.min(value, precioMax));
    },
    [priceRange.min, precioMax],
  );

  const handleMaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const value = raw ? Math.max(0, Number(raw)) : priceRange.max;
      setPrecioMax(Math.max(value, precioMin));
    },
    [priceRange.max, precioMin],
  );

  const handleYearSliderChange = useCallback((values: number[]) => {
    setAnioMin(values[0]);
  }, []);

  const handleKilometrajeSliderChange = useCallback((values: number[]) => {
    setKmin(values[0]);
    setKmax(values[1]);
  }, []);

  const handleKminInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const value = raw ? Math.max(0, Number(raw)) : kilometrajeRange.min;
      setKmin(Math.min(value, kmax));
    },
    [kilometrajeRange.min, kmax],
  );

  const handleKmaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      const value = raw ? Math.max(0, Number(raw)) : kilometrajeRange.max;
      setKmax(Math.max(value, kmin));
    },
    [kilometrajeRange.max, kmin],
  );

  const navigate = useCallback(
    (params: URLSearchParams) => {
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, startTransition],
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    etiqueta ? params.set("etiqueta", etiqueta) : params.delete("etiqueta");
    combustible
      ? params.set("combustible", combustible)
      : params.delete("combustible");
    precioMin !== priceRange.min
      ? params.set("precio-min", String(precioMin))
      : params.delete("precio-min");
    precioMax !== priceRange.max
      ? params.set("precio-max", String(precioMax))
      : params.delete("precio-max");
    anioMin !== minYear
      ? params.set("anio", String(anioMin))
      : params.delete("anio");
    kmin !== kilometrajeRange.min
      ? params.set("kmin", String(kmin))
      : params.delete("kmin");
    kmax !== kilometrajeRange.max
      ? params.set("kmax", String(kmax))
      : params.delete("kmax");

    navigate(params);
    setOpen(false);
  }, [
    searchParams,
    etiqueta,
    combustible,
    precioMin,
    precioMax,
    anioMin,
    kmin,
    kmax,
    priceRange,
    minYear,
    kilometrajeRange,
    navigate,
  ]);

  const clearFilters = useCallback(() => {
    setEtiqueta("");
    setCombustible("");
    setPrecioMin(priceRange.min);
    setPrecioMax(priceRange.max);
    setAnioMin(minYear);
    setKmin(kilometrajeRange.min);
    setKmax(kilometrajeRange.max);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("etiqueta");
    params.delete("combustible");
    params.delete("precio-min");
    params.delete("precio-max");
    params.delete("anio");
    params.delete("kmin");
    params.delete("kmax");

    navigate(params);
    setOpen(false);
  }, [searchParams, priceRange, minYear, kilometrajeRange, navigate]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setEtiqueta(searchParams.get("etiqueta") ?? "");
        setCombustible(searchParams.get("combustible") ?? "");
        setPrecioMin(
          Number(searchParams.get("precio-min")) || priceRange.min,
        );
        setPrecioMax(
          Number(searchParams.get("precio-max")) || priceRange.max,
        );
        setAnioMin(Number(searchParams.get("anio")) || minYear);
        setKmin(Number(searchParams.get("kmin")) || kilometrajeRange.min);
        setKmax(Number(searchParams.get("kmax")) || kilometrajeRange.max);
      }
      setOpen(isOpen);
    },
    [searchParams, priceRange, minYear, kilometrajeRange],
  );

  return {
    open,
    setOpen: handleOpenChange,
    state: { etiqueta, combustible, precioMin, precioMax, anioMin, kmin, kmax },
    activeFilterCount,
    isPriceModified,
    isYearModified,
    isKilometrajeModified,
    setEtiqueta,
    setCombustible,
    setPrecioMin,
    setPrecioMax,
    setAnioMin,
    handleSliderChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleYearSliderChange,
    handleKilometrajeSliderChange,
    handleKminInputChange,
    handleKmaxInputChange,
    applyFilters,
    clearFilters,
  };
}

export { CURRENT_YEAR };
