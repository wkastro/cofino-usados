# Especificaciones — Diseño

**Fecha:** 2026-04-15  
**Estado:** Aprobado  
**Scope:** Feature CRUD para Transmisión, Combustible, Tracción y Estado de venta

---

## Contexto

Actualmente, los campos `transmision`, `combustible`, `traccion` y `estado` del modelo `Vehiculo` son enums de Prisma con valores fijos en el código. Esto impide que un administrador gestione dinámicamente estos valores desde el dashboard.

La solución es convertir los cuatro enums a modelos de base de datos relacionales, con CRUD completo en el dashboard bajo `/dashboard/especificaciones`.

---

## 1. Schema de base de datos

### Nuevos modelos

Cuatro modelos con estructura idéntica:

```prisma
model Transmision {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model Combustible {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model Traccion {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}

model EstadoVenta {
  id        String     @id @default(uuid()) @db.Char(36)
  nombre    String     @unique
  slug      String     @unique
  estado    Boolean    @default(true)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  vehiculos Vehiculo[]
}
```

### Cambios en Vehiculo

Los cuatro campos enum se reemplazan por foreign keys:

```prisma
// Eliminar
transmision  Transmision  (enum)
combustible  Combustible  (enum)
traccion     Traccion     (enum)
estado       EstadoVenta  (enum)

// Agregar
transmisionId  String      @db.Char(36)
combustibleId  String      @db.Char(36)
traccionId     String      @db.Char(36)
estadoId       String      @db.Char(36)

transmision    Transmision  @relation(fields: [transmisionId], references: [id])
combustible    Combustible  @relation(fields: [combustibleId], references: [id])
traccion       Traccion     @relation(fields: [traccionId], references: [id])
estadoVenta    EstadoVenta  @relation(fields: [estadoId], references: [id])
```

Los índices actuales `@@index([transmision])`, `@@index([combustible])`, etc., se reemplazan por índices sobre los nuevos campos ID.

### Eliminación de enums

Se eliminan del schema los enums: `Transmision`, `Combustible`, `Traccion`, `EstadoVenta`.

### Seed de migración

Seed para poblar los valores iniciales desde los enums actuales:

| Modelo      | Valores iniciales                                  |
|-------------|----------------------------------------------------|
| Transmision | Automático (automatico), Manual (manual)           |
| Combustible | Gasolina, Diésel, Híbrido, Eléctrico               |
| Traccion    | 4x4, 4x2, AWD, 4WD                                 |
| EstadoVenta | Disponible, Reservado, Facturado                   |

---

## 2. Estructura de la feature

```
features/dashboard/especificaciones/
├── components/
│   ├── especificaciones-page.tsx          # Página con Tabs (Server Component)
│   ├── especificaciones-tab.tsx           # Tab genérico reutilizable
│   ├── especificaciones-table/
│   │   ├── columns.tsx                    # Columnas de tabla (nombre, slug, estado, acciones)
│   │   └── row-actions.tsx                # Menú desplegable por fila
│   └── especificaciones-dialog/
│       ├── create-dialog.tsx              # Dialog de creación
│       └── edit-dialog.tsx                # Dialog de edición
├── hooks/
│   ├── useEspecificacionesTable.ts        # Estado de búsqueda y paginación local
│   └── useEspecificacionForm.ts           # RHF + Zod + submit a server action
├── actions/
│   └── especificaciones.actions.ts        # create, update, delete, toggleEstado
├── queries/
│   └── especificaciones.queries.ts        # Queries cacheadas por modelo
├── validations/
│   └── especificacion.ts                  # Zod schema: nombre + slug
└── types/
    └── especificacion.ts                  # Tipos TS compartidos
```

### Página

`app/dashboard/especificaciones/page.tsx` — Server Component que carga los 4 modelos en paralelo con `Promise.all` y renderiza `<EspecificacionesPage>`.

---

## 3. Flujo de datos

### Queries (cacheadas)

```ts
getCachedTransmisiones()    // cacheTag: "admin-transmisiones"
getCachedCombustibles()     // cacheTag: "admin-combustibles"
getCachedTracciones()       // cacheTag: "admin-tracciones"
getCachedEstados()          // cacheTag: "admin-estados"
getCachedAllEspecificaciones() // Promise.all de las 4 anteriores
```

Todas usan `"use cache"` con `cacheLife("hours")`.

### Server Actions

```ts
createEspecificacion(tipo: EspecificacionTipo, input: EspecificacionInput)
updateEspecificacion(tipo: EspecificacionTipo, id: string, input: EspecificacionInput)
deleteEspecificacion(tipo: EspecificacionTipo, id: string)
toggleEstadoEspecificacion(tipo: EspecificacionTipo, id: string, estado: boolean)
```

`EspecificacionTipo = "transmision" | "combustible" | "traccion" | "estado"`

Cada acción usa `requireAdmin()`, valida con Zod, opera sobre el modelo Prisma correcto según `tipo`, y revalida el cache correspondiente.

`deleteEspecificacion` verifica que no haya vehículos asociados antes de eliminar. Si los hay, retorna `{ ok: false, message: "..." }`.

### Hooks

- `useEspecificacionForm(tipo, defaultValues?)` — encapsula RHF + Zod, auto-genera slug desde nombre, llama la server action, maneja errores de campo y de servidor
- `useEspecificacionesTable(data)` — encapsula estado de búsqueda local y paginación

### Validación Zod

```ts
const especificacionSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
})
```

El slug se auto-genera en el cliente al escribir el nombre (misma lógica que vehiculos).

---

## 4. UI y experiencia de usuario

### Página `/dashboard/especificaciones`

- Tabs de shadcn: **Transmisión | Combustible | Tracción | Estado de venta**
- Cada tab es `<EspecificacionesTab tipo="..." data={...} />`

### Cada tab

| Elemento       | Detalle                                                                 |
|----------------|-------------------------------------------------------------------------|
| Encabezado     | Título del tab + botón "Nuevo" que abre `CreateDialog`                  |
| Tabla          | Columnas: Nombre, Slug, Estado (badge), Acciones                        |
| Row actions    | Editar → `EditDialog` \| Activar/Desactivar \| Eliminar con `AlertDialog` |
| Estado vacío   | Mensaje descriptivo si no hay registros                                 |

### Dialogs

Formulario con dos campos: **Nombre** y **Slug** (auto-generado, editable). Estado no se gestiona desde el formulario — solo desde la acción de toggle en la tabla.

### Feedback

Toasts de éxito/error después de cada acción (mismo patrón que vehiculos).

---

## 5. Actualización del módulo de vehículos

- `getCachedRelationOptions` se amplía para incluir las 4 nuevas queries
- `step-especificaciones.tsx` recibe los options desde BD (en lugar de leer enums)
- Schema Zod de `vehiculoSchema` reemplaza campos enum por `z.string().uuid()`
- Tipo `VehiculoInput` se actualiza acorde
- `vehiculo.actions.ts` actualiza los campos de create/update para usar IDs

---

## Decisiones tomadas

| Decisión | Razón |
|----------|-------|
| Modelos DB en lugar de enums | Permite gestión dinámica desde el dashboard sin deploys |
| UI con Dialogs inline | Formularios de 3 campos no justifican páginas o sheets separados |
| Tab genérico reutilizable | Evita duplicar estructura para los 4 modelos |
| Slug único para filtros | Permite usar slugs en URLs de filtros del sitio público |
| `estado` boolean en cada modelo | Consistente con Marca, Categoria, EtiquetaComercial |
