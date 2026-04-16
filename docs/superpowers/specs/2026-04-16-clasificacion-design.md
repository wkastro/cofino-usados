# Clasificación CRUD — Design Spec

**Date:** 2026-04-16  
**Status:** Approved  
**Scope:** CRUD completo para Marca, Categoría, EtiquetaComercial y Sucursal en el dashboard admin.

---

## 1. Objetivo

Implementar un módulo de administración en `/dashboard/clasificacion` que permita crear, editar, activar/desactivar y eliminar registros de las 4 entidades de clasificación de vehículos: Marca, Categoría, Etiqueta Comercial y Sucursal. El módulo sigue el patrón establecido en `features/dashboard/especificaciones`.

---

## 2. Rutas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/dashboard/clasificacion` | Server page | Lista todas las clasificaciones en tabs |

Se agrega el ítem `Clasificación` al sidebar de navegación.

---

## 3. Estructura de archivos

```
app/dashboard/clasificacion/
  page.tsx

features/dashboard/clasificacion/
  types/
    clasificacion.ts        # ClasificacionTipo, Clasificacion, AllClasificaciones, ActionResult
    sucursal.ts             # Sucursal, SucursalActionResult
  validations/
    clasificacion.ts        # Schema nombre+slug (mismo que especificaciones)
    sucursal.ts             # Schema nombre+direccion+latitud+longitud+maps?+waze?
  lib/
    slug.ts                 # generateSlug helper
  actions/
    clasificacion.actions.ts   # create/update/delete/toggle para marca|categoria|etiquetaComercial
    sucursal.actions.ts        # create/update/delete/toggle para Sucursal
  queries/
    clasificacion.queries.ts   # getCachedMarcas, getCachedCategorias, getCachedEtiquetas,
                               # getCachedSucursales, getCachedAllClasificaciones
  hooks/
    useClasificacionForm.ts    # Hook genérico nombre+slug para las 3 entidades simples
    useClasificacionTable.ts   # Hook de búsqueda/filtro genérico
    useSucursalForm.ts         # Hook específico de Sucursal (campos extendidos)
  components/
    clasificacion-page.tsx          # Tabs: Marca | Categoría | Etiqueta Comercial | Sucursal
    clasificacion-tab.tsx           # Tab genérico reutilizable para las 3 entidades simples
    clasificacion-dialog/
      create-dialog.tsx             # Dialog crear (genérico, nombre+slug)
      edit-dialog.tsx               # Dialog editar (genérico, nombre+slug)
    clasificacion-table/
      columns.tsx                   # Columnas: nombre, slug, estado, acciones
      row-actions.tsx               # Dropdown: editar, activar/desactivar, eliminar
    sucursal-tab.tsx                # Tab dedicado para Sucursal
    sucursal-dialog/
      create-dialog.tsx             # Dialog crear Sucursal
      edit-dialog.tsx               # Dialog editar Sucursal
    sucursal-table/
      columns.tsx                   # Columnas: nombre, dirección, estado, acciones
      row-actions.tsx               # Acciones Sucursal
```

---

## 4. Tipos

### `types/clasificacion.ts`

```typescript
export type ClasificacionTipo = "marca" | "categoria" | "etiquetaComercial"

export interface Clasificacion {
  id: string
  nombre: string
  slug: string
  estado: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AllClasificaciones {
  marcas: Clasificacion[]
  categorias: Clasificacion[]
  etiquetas: Clasificacion[]
  sucursales: Sucursal[]
}

export type ActionSuccess<T = undefined> = { ok: true; message: string; data?: T }
export type ActionError = { ok: false; message: string; fieldErrors?: Record<string, string[]> }
export type ClasificacionActionResult<T = undefined> = ActionSuccess<T> | ActionError
```

### `types/sucursal.ts`

```typescript
export interface Sucursal {
  id: string
  nombre: string
  direccion: string
  latitud: number
  longitud: number
  maps: string | null
  waze: string | null
  estado: boolean
  createdAt: Date
  updatedAt: Date
}

export type SucursalActionResult<T = undefined> = ActionSuccess<T> | ActionError
```

---

## 5. Validaciones

### `validations/clasificacion.ts`
- `nombre`: string, min 1
- `slug`: string, min 1, regex `/^[a-z0-9-]+$/`

### `validations/sucursal.ts`
- `nombre`: string, min 1
- `direccion`: string, min 1
- `latitud`: number (coerce desde string del input)
- `longitud`: number (coerce desde string del input)
- `maps`: string url, optional o empty string → null
- `waze`: string url, optional o empty string → null

---

## 6. Queries y cache

Todas las queries usan `"use cache"` + `cacheLife("hours")` de Next.js 16.

| Función | Cache Tag |
|---------|-----------|
| `getCachedMarcas()` | `"admin-marcas"` |
| `getCachedCategorias()` | `"admin-categorias"` |
| `getCachedEtiquetas()` | `"admin-etiquetas"` |
| `getCachedSucursales()` | `"admin-sucursales"` |
| `getCachedAllClasificaciones()` | `"admin-all-clasificaciones"` |

`getCachedAllClasificaciones()` llama las 4 queries en paralelo con `Promise.all`.

---

## 7. Actions

### `clasificacion.actions.ts`

Delegate dinámico por tipo:
```typescript
function getDelegate(tipo: ClasificacionTipo) {
  switch (tipo) {
    case "marca":             return prisma.marca
    case "categoria":         return prisma.categoria
    case "etiquetaComercial": return prisma.etiquetaComercial
  }
}
```

Funciones: `createClasificacion`, `updateClasificacion`, `deleteClasificacion`, `toggleEstadoClasificacion`.

- Todas llaman `requireAdmin()` al inicio
- Delete verifica `prisma.vehiculo.count({ where: { [fkField]: id } })` antes de eliminar
- FK fields: `marca → marcaId`, `categoria → categoriaId`, `etiquetaComercial → etiquetaComercialId`
- En mutación exitosa invalida el tag específico + `"admin-all-clasificaciones"`
- Error P2002 → mensaje "Ya existe un registro con ese nombre o slug"

### `sucursal.actions.ts`

Funciones: `createSucursal`, `updateSucursal`, `deleteSucursal`, `toggleEstadoSucursal`.

- Delete verifica `prisma.vehiculo.count({ where: { sucursalId: id } })`
- Invalida `"admin-sucursales"` + `"admin-all-clasificaciones"`

---

## 8. Hooks

### `useClasificacionForm`
- Mismo patrón que `useEspecificacionForm`
- Acepta `tipo: ClasificacionTipo`, `defaultValues?: Clasificacion`, `onSuccess?: () => void`
- Al editar nombre genera slug automáticamente (solo en modo create)
- Llama `createClasificacion` o `updateClasificacion` según `isEditing`

### `useClasificacionTable`
- Filtra por `nombre` y `slug`
- Mismo patrón que `useEspecificacionesTable`

### `useSucursalForm`
- Acepta `defaultValues?: Sucursal`, `onSuccess?: () => void`
- Llama `createSucursal` o `updateSucursal`
- Sin generación de slug (Sucursal no tiene slug)

---

## 9. Componentes

### `ClasificacionPage`
Server-rendered shell. Recibe `AllClasificaciones` y renderiza 4 tabs:
- `<ClasificacionTab tipo="marca" titulo="Marca" data={marcas} />`
- `<ClasificacionTab tipo="categoria" titulo="Categoría" data={categorias} />`
- `<ClasificacionTab tipo="etiquetaComercial" titulo="Etiqueta Comercial" data={etiquetas} />`
- `<SucursalTab data={sucursales} />`

### `ClasificacionTab` (client)
Mismo patrón que `EspecificacionesTab`:
- Barra con búsqueda + botón "Nuevo"
- Tabla TanStack con columnas: nombre, slug, estado (Badge), acciones
- Estado local: `createOpen`, `editOpen`, `selectedRow`

### `SucursalTab` (client)
Mismo patrón visual que `ClasificacionTab`:
- Columnas de tabla: nombre, dirección, estado (Badge), acciones
- Dialogs propios de Sucursal

### Dialogs genéricos (Clasificacion)
- `CreateDialog`: formulario con Nombre (+ slug auto) y Slug
- `EditDialog`: igual pero pre-poblado, recibe `row: Clasificacion`

### Dialogs de Sucursal
- `CreateDialog`: Nombre, Dirección, Latitud, Longitud, Google Maps (opcional), Waze (opcional)
- `EditDialog`: igual pero pre-poblado

### Row Actions (ambos)
Dropdown con: Editar, Activar/Desactivar, Eliminar (con AlertDialog de confirmación).

---

## 10. Sidebar

En `features/dashboard/navigation/sidebar/sidebar-items.ts` se agrega:
```typescript
{
  title: "Clasificación",
  url: "/dashboard/clasificacion",
  icon: TagsIcon,  // lucide-react
}
```

---

## 11. Decisiones clave

- **No se implementa** el campo `thumbnail` de Categoria.
- **No se implementa** el campo `codigoAs400` de Sucursal.
- Sucursal no tiene `slug` — el formulario omite ese campo.
- Las coordenadas (`latitud`, `longitud`) se ingresan manualmente como campos numéricos.
- `maps` y `waze` son URLs opcionales; strings vacíos se convierten a `null` en el action.
- El patrón de cache es idéntico al de especificaciones (`"use cache"` + `updateTag`).
