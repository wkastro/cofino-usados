# Sistemas de recomendación: Home y Detalle de vehículo

**Fecha:** 2026-04-07
**Estado:** Aprobado para planificación
**Scope:** Implementación de dos sistemas de recomendación independientes para `app/page.tsx` (home) y `app/comprar/[slug]/page.tsx` (detalle).

---

## 1. Objetivo

Agregar al sitio dos secciones de recomendaciones de vehículos:

1. **Home** — sección "Vehículos destacados" con hasta **6** vehículos seleccionados por criterios de negocio (popularidad/destacados).
2. **Detalle de vehículo** — sección "Vehículos similares" con hasta **3** vehículos relacionados al que el usuario está viendo, **nunca incluyendo el vehículo actual**.

Ambos sistemas son **content-based** (no dependen de historial de usuario) y se calculan contra la base de datos vía Prisma.

---

## 2. Arquitectura general

### 2.1 Nuevo feature

Se crea un feature aislado siguiendo el patrón existente (`features/filters/`, `app/actions/vehiculo.cached.ts`):

```
features/recommendations/
  actions/
    recommendations.ts          # queries Prisma crudas
    recommendations.cached.ts   # wrappers "use cache" + tags
  components/
    home-recommendations.tsx           # server component, 6 cards
    home-recommendations-skeleton.tsx  # fallback de Suspense
    similar-vehicles.tsx               # server component, 3 cards
    similar-vehicles-skeleton.tsx      # fallback de Suspense
  types/
    recommendation.ts           # solo si se necesitan subtipos
```

Si `VehicleCardSkeletonGrid` existente acepta un `count` configurable, se reutiliza y se omiten los archivos `*-skeleton.tsx` locales del feature.

### 2.2 Flujo de datos

1. Las páginas incluyen los componentes dentro de `<Suspense>`.
2. Los componentes (server components) llaman a las acciones cacheadas.
3. Las acciones cacheadas envuelven queries Prisma crudas con `"use cache"`, `cacheLife` y `cacheTag`.
4. Se reutiliza `components/global/vehicle-card.tsx` para el render.

### 2.3 Principios

- Server components puros — cero JS al cliente adicional (salvo el que ya lleva `VehicleCard`).
- Cacheo centralizado en `recommendations.cached.ts`.
- **No se excluyen vehículos por `estado`** — se consideran todos los vehículos existentes en la DB.
- Las queries incluyen las mismas relaciones (`marca`, `sucursal`, `categoria`, `etiquetaComercial`, `galeria` si aplica) que `getVehiculos` ya usa.

---

## 3. Lógica del HOME

**Criterio:** popularidad/destacados con control de negocio + variedad visual.

**Inputs:** ninguno.
**Output:** hasta 6 vehículos.

### 3.1 Algoritmo

**Paso 1 — Query de destacados:**
```
SELECT * FROM Vehiculo
WHERE etiquetaComercialId IS NOT NULL
ORDER BY createdAt DESC
```
Sin LIMIT inicial (el filtro de diversidad decide cuántos tomar).

**Paso 2 — Diversidad por marca (máx. 2 por marca):**
- Iterar la lista en orden.
- Llevar `marcaCount: Record<string, number>`.
- Incluir cada vehículo solo si `marcaCount[marcaId] < 2`.
- Cortar el loop cuando el resultado alcance 6 vehículos.

**Paso 3 — Fallback con recientes:**
Si después del paso 2 hay menos de 6:
```
SELECT * FROM Vehiculo
WHERE id NOT IN (<ids ya incluidos>)
ORDER BY createdAt DESC
```
Aplicar la misma regla de diversidad (contador compartido con el paso 2). Completar hasta 6.

**Paso 4 — Relajación final:**
Si aún faltan (stock muy limitado), relajar la restricción de diversidad y tomar los más recientes restantes hasta llegar a 6.

### 3.2 API

```ts
// features/recommendations/actions/recommendations.ts
export async function getHomeRecommendations(): Promise<Vehiculo[]>;

// features/recommendations/actions/recommendations.cached.ts
export async function getCachedHomeRecommendations(): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("home-recommendations");
  return getHomeRecommendations();
}
```

---

## 4. Lógica del DETALLE

**Criterio:** similitud content-based por categoría → marca → precio, con cascada de relajación.

**Inputs:** `slug: string` del vehículo actual.
**Output:** hasta 3 vehículos, **nunca el actual**.

### 4.1 Preparación

1. Llamar `getCachedVehicleBySlug(slug)` (función ya existente).
2. Si devuelve `null`, retornar `[]`.
3. Extraer `currentId`, `categoriaId`, `marcaId`, `precio`.
4. Calcular `minPrecio = precio * 0.80`, `maxPrecio = precio * 1.20` (±20%).

### 4.2 Cascada de 4 niveles

En cada nivel se excluye `currentId` y todos los IDs ya seleccionados en niveles previos. Al final de cada nivel, si el resultado acumulado llega a 3, se retorna.

**Nivel 1 — categoría + marca + precio ±20%:**
```
WHERE id != currentId
  AND categoriaId = currentCategoriaId
  AND marcaId = currentMarcaId
  AND precio BETWEEN minPrecio AND maxPrecio
ORDER BY ABS(precio - currentPrecio) ASC
LIMIT 3
```

**Nivel 2 — categoría + marca (precio libre):**
```
WHERE id != currentId
  AND id NOT IN (<ya seleccionados>)
  AND categoriaId = currentCategoriaId
  AND marcaId = currentMarcaId
ORDER BY ABS(precio - currentPrecio) ASC
LIMIT (3 - ya_seleccionados)
```

**Nivel 3 — categoría (marca libre):**
```
WHERE id != currentId
  AND id NOT IN (<ya seleccionados>)
  AND categoriaId = currentCategoriaId
ORDER BY ABS(precio - currentPrecio) ASC
LIMIT (3 - ya_seleccionados)
```

**Nivel 4 — fallback global:**
```
WHERE id != currentId
  AND id NOT IN (<ya seleccionados>)
ORDER BY createdAt DESC
LIMIT (3 - ya_seleccionados)
```

### 4.3 API

```ts
// features/recommendations/actions/recommendations.ts
export async function getSimilarVehicles(slug: string): Promise<Vehiculo[]>;

// features/recommendations/actions/recommendations.cached.ts
export async function getCachedSimilarVehicles(slug: string): Promise<Vehiculo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`similar-vehicles-${slug}`);
  return getSimilarVehicles(slug);
}
```

### 4.4 Edge cases

- `getVehicleBySlug(slug)` devuelve `null` → retornar `[]`; el componente no renderiza nada.
- DB con menos de 4 vehículos totales → retornar los que existan (puede ser 0, 1 o 2).

---

## 5. Componentes UI

Ambos son **server components** (sin `"use client"`) y reutilizan `components/global/vehicle-card.tsx`.

### 5.1 `HomeRecommendations`

```tsx
// features/recommendations/components/home-recommendations.tsx
import { getCachedHomeRecommendations } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";
import { Container } from "@/components/layout/container";

export async function HomeRecommendations(): Promise<React.ReactElement | null> {
  const vehicles = await getCachedHomeRecommendations();
  if (vehicles.length === 0) return null;

  return (
    <section className="py-12">
      <Container>
        <h2 className="text-fs-xl font-semibold mb-6">Vehículos destacados</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </Container>
    </section>
  );
}
```

Grid 1/2/3 columnas (mobile/tablet/desktop). 6 vehículos → 2 filas en desktop.

### 5.2 `SimilarVehicles`

```tsx
// features/recommendations/components/similar-vehicles.tsx
import { getCachedSimilarVehicles } from "../actions/recommendations.cached";
import { VehicleCard } from "@/components/global/vehicle-card";

interface SimilarVehiclesProps {
  slug: string;
}

export async function SimilarVehicles({ slug }: SimilarVehiclesProps): Promise<React.ReactElement | null> {
  const vehicles = await getCachedSimilarVehicles(slug);
  if (vehicles.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-fs-xl font-semibold mb-6">Vehículos similares</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </section>
  );
}
```

3 columnas en desktop → 3 recomendaciones en una sola fila. Separador `border-t` para delimitar del contenido del detalle.

### 5.3 Skeletons

Cada componente se envuelve en `<Suspense>` en la página padre. Se usa un skeleton con el mismo estilo visual que `VehicleCardSkeletonGrid`:

- `HomeRecommendationsSkeleton` — 6 tarjetas placeholder.
- `SimilarVehiclesSkeleton` — 3 tarjetas placeholder.

Si `VehicleCardSkeletonGrid` acepta un prop `count`, se reutiliza directamente y se omiten los archivos locales.

---

## 6. Integración en páginas

### 6.1 `app/page.tsx`

Añadir al final del layout, después de `<AnnouncementGrid />` (o donde haga más sentido visualmente):

```tsx
<Suspense fallback={<HomeRecommendationsSkeleton />}>
  <HomeRecommendations />
</Suspense>
```

### 6.2 `app/comprar/[slug]/page.tsx`

Resolver `params` al inicio de la página y pasar el slug:

```tsx
export default async function BuyPage({ params }: BuyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  return (
    <Container className="py-4">
      <Suspense fallback={/* skeleton actual */}>
        <PurchaseContent params={params} />
      </Suspense>

      <Suspense fallback={<SimilarVehiclesSkeleton />}>
        <SimilarVehicles slug={slug} />
      </Suspense>
    </Container>
  );
}
```

---

## 7. Limpieza y documentación

### 7.1 Eliminar `lib/data/cars.json`

- Borrar el archivo.
- Verificar con Grep que no haya imports residuales (el único match actual es `CLAUDE.md`).
- Actualizar `CLAUDE.md`: eliminar la línea *"Demo vehicle data is currently served from `lib/data/cars.json` (not from DB)"* ya que ahora toda la data viene de la base de datos vía Prisma.

### 7.2 Tipos

Reutilizar `Vehiculo` de `@/types/vehiculo/vehiculo`. Solo crear `features/recommendations/types/recommendation.ts` si durante la implementación surge un subtipo específico.

### 7.3 Estrategia de cache — resumen

| Función | `cacheLife` | `cacheTag` |
|---|---|---|
| `getCachedHomeRecommendations` | `hours` | `home-recommendations` |
| `getCachedSimilarVehicles(slug)` | `hours` | `similar-vehicles-${slug}` |

La invalidación desde los flujos admin (cuando se crea/edita/borra un vehículo) queda fuera del scope de esta tarea. Los tags quedan listos para que en el futuro se invoquen `revalidateTag("home-recommendations")` y `revalidateTag("similar-vehicles-<slug>")` desde las acciones correspondientes.

---

## 8. Fuera de scope

- Invalidación automática de tags desde acciones admin.
- A/B tests o tracking de clicks en recomendaciones.
- Personalización basada en historial de navegación del usuario.
- Uso de `favoritos` o `reviews` como señales del algoritmo de home.
- Ordenamiento aleatorio o rotación de resultados.

---

## 9. Criterios de éxito

1. `app/page.tsx` muestra una sección "Vehículos destacados" con hasta 6 vehículos.
2. `app/comprar/[slug]/page.tsx` muestra una sección "Vehículos similares" con hasta 3 vehículos, excluyendo el actual.
3. Ambas secciones se cargan vía `<Suspense>` con skeletons.
4. Ambas queries están cacheadas con `use cache` y tags invalidables.
5. `lib/data/cars.json` eliminado; `CLAUDE.md` actualizado.
6. `npm run build` y `npm run lint` pasan sin errores.
