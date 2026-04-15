import { getCachedCategories, getCachedBrands, getCachedTransmissions } from "@/app/actions/vehiculo.cached";
import { HomeSearchBar } from "@/features/filters/components/home-search-bar";
import type { SearchParams } from "@/types/filters/filters";

interface HomeSearchBarContentProps {
  searchParams: Promise<SearchParams>;
  className?: string;
}

export async function HomeSearchBarContent({ searchParams, className }: HomeSearchBarContentProps): Promise<React.ReactElement> {
  const [categories, brands, transmissions] = await Promise.all([
    getCachedCategories(),
    getCachedBrands(),
    getCachedTransmissions(),
  ]);

  return (
    <HomeSearchBar brands={brands} categories={categories} transmissions={transmissions} className={className} />
  );
}
