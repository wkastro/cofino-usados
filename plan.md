# Plan: Componente SearchFilterBar

## Archivos a crear

### 1. `features/filters/components/search-filter-bar.tsx`

Componente reutilizable con:

- **3 Select** (shadcn): Marca, Modelo, Transmisión — cada uno con label encima
- **Botón "Filtros"** (Button variant `outline` con `FilterHorizontalIcon`)
- **Botón "¡Encontrar mi auto!"** (Button variant `dark` con `Car01Icon`)
- Card blanca con `rounded-2xl`, `shadow-lg`, `border border-border/50`
- Envuelto en `Container` para max-width consistente
- **Props controladas**: opciones para cada select, valores, callbacks (onFilterChange, onSearch, onFiltersClick)

**Responsive:**

- Desktop (lg+): Todo en una fila horizontal, selects en grid 3 columnas
- Tablet (md): Selects en 3 columnas, botones debajo
- Mobile: Selects apilados (1 columna), botones abajo a ancho completo

### 2. `features/filters/components/home-search-bar.tsx`

Wrapper `"use client"` específico para la home page que:

- Conecta el `SearchFilterBar` con opciones estáticas de marcas/transmisión
- Calcula modelos dinámicamente según la marca seleccionada
- Aplica el overlap sobre el hero con `className="-mt-12 md:-mt-8"`

### 3. Modificar `app/page.tsx`

Insertar `<HomeSearchBar />` entre `<Hero />` y `<VehicleGrid />`.

## Componentes shadcn utilizados

- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` (ya instalado)
- `Button` con variants `outline` y `dark` (ya instalado)
- `Label` (ya instalado) — para las etiquetas sobre cada select

## Iconos

- `FilterHorizontalIcon` de `@hugeicons/core-free-icons` (para botón Filtros)
- `Car01Icon` de `@hugeicons/core-free-icons` (para botón CTA)
