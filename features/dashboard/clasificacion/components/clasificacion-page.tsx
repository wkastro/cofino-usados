import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/dashboard/components/ui/tabs"
import { ClasificacionTab } from "./clasificacion-tab"
import { SucursalTab } from "./sucursal-tab"
import type { AllClasificaciones } from "../types/clasificacion"

interface ClasificacionPageProps {
  data: AllClasificaciones
}

export function ClasificacionPage({ data }: ClasificacionPageProps) {
  return (
    <Tabs defaultValue="marca" className="flex flex-col gap-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="marca">Marca</TabsTrigger>
        <TabsTrigger value="categoria">Categoría</TabsTrigger>
        <TabsTrigger value="etiqueta">Etiqueta Comercial</TabsTrigger>
        <TabsTrigger value="sucursal">Sucursal</TabsTrigger>
      </TabsList>
      <TabsContent value="marca">
        <ClasificacionTab tipo="marca" titulo="Marca" data={data.marcas} />
      </TabsContent>
      <TabsContent value="categoria">
        <ClasificacionTab tipo="categoria" titulo="Categoría" data={data.categorias} />
      </TabsContent>
      <TabsContent value="etiqueta">
        <ClasificacionTab tipo="etiquetaComercial" titulo="Etiqueta Comercial" data={data.etiquetas} />
      </TabsContent>
      <TabsContent value="sucursal">
        <SucursalTab data={data.sucursales} />
      </TabsContent>
    </Tabs>
  )
}
