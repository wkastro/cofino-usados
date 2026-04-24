import type { BlockDefinition } from "@/features/cms/types/block"

export interface BancoItem {
  id:     string
  nombre: string
}

export interface CuotaItem {
  meses: number
}

export interface CalculadoraContent {
  titulo:      string
  descripcion: string
  bancos:      BancoItem[]
  cuotas:      CuotaItem[]
}

export const calculadoraBlock: BlockDefinition<CalculadoraContent> = {
  key: "calculadora",
  label: "Calculadora de Cuotas",
  fields: [
    { key: "titulo",      label: "Título",      type: "text",     required: true },
    { key: "descripcion", label: "Descripción", type: "textarea"                 },
    {
      key: "bancos",
      label: "Banco",
      type: "list",
      itemFields: [
        { key: "id",     label: "ID (clave única)", type: "text", required: true },
        { key: "nombre", label: "Nombre del banco", type: "text", required: true },
      ],
    },
    {
      key: "cuotas",
      label: "Cuota (meses)",
      type: "list",
      itemFields: [
        { key: "meses", label: "Cantidad de meses", type: "number", required: true },
      ],
    },
  ],
  defaultValue: {
    titulo:      "¿Deseas calcular tus cuotas?",
    descripcion: "Ingresa la siguiente información para calcular.",
    bancos: [
      { id: "bi",  nombre: "Banco Industrial"  },
      { id: "bac", nombre: "BAC Credomatic"    },
      { id: "gyt", nombre: "G&T Continental"   },
    ],
    cuotas: [
      { meses: 24 },
      { meses: 60 },
      { meses: 90 },
    ],
  },
}
