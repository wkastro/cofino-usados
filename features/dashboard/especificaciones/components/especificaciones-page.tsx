import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/dashboard/components/ui/tabs"
import { EspecificacionesTab } from "./especificaciones-tab"
import type { AllEspecificaciones } from "../types/especificacion"

interface EspecificacionesPageProps {
  data: AllEspecificaciones
}

export function EspecificacionesPage({ data }: EspecificacionesPageProps) {
  return (
    <Tabs defaultValue="transmision" className="flex flex-col gap-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="transmision">Transmisión</TabsTrigger>
        <TabsTrigger value="combustible">Combustible</TabsTrigger>
        <TabsTrigger value="traccion">Tracción</TabsTrigger>
        <TabsTrigger value="estado">Estado de venta</TabsTrigger>
      </TabsList>
      <TabsContent value="transmision">
        <EspecificacionesTab tipo="transmision" titulo="Transmisión" data={data.transmisiones} />
      </TabsContent>
      <TabsContent value="combustible">
        <EspecificacionesTab tipo="combustible" titulo="Combustible" data={data.combustibles} />
      </TabsContent>
      <TabsContent value="traccion">
        <EspecificacionesTab tipo="traccion" titulo="Tracción" data={data.tracciones} />
      </TabsContent>
      <TabsContent value="estado">
        <EspecificacionesTab tipo="estado" titulo="Estado de venta" data={data.estados} />
      </TabsContent>
    </Tabs>
  )
}
