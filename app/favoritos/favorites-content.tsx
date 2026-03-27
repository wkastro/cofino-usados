import { getFavoriteVehiculos } from "@/app/actions/favorito";
import { VehicleCard } from "@/components/global/vehicle-card";
import { NoResults } from "@/components/global/no-results";

export async function FavoritesContent() {
  const vehiculos = await getFavoriteVehiculos();

  if (vehiculos.length === 0) {
    return (
      <NoResults
        title="No tienes vehículos favoritos"
        description="Explora nuestro catálogo y marca los vehículos que te gusten con el ícono de corazón."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {vehiculos.map((vehiculo) => (
        <VehicleCard key={vehiculo.id} vehicle={vehiculo} />
      ))}
    </div>
  );
}
